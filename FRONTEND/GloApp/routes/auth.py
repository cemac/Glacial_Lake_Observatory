
from flask import Blueprint, render_template, flash, redirect, url_for, request, session, g
from GloApp.helpers.db_helpers import get_db  # Make sure to import get_db
from GloApp.forms.user_forms import LoginForm, ChangePwdForm, UsersForm, AccessForm
from GloApp.helpers.auth_helpers import authenticate_user, InsertUser, DeleteUser, AssignRole
from GloApp.decorators.auth_decorators import is_logged_in, is_logged_in_as_admin
from GloApp.helpers.form_utils import table_list
from passlib.hash import sha256_crypt
from flask_mail import Message, Mail
import pandas as pd

auth_bp = Blueprint('auth', __name__)

# Login
@auth_bp.route('/login', methods=["GET", "POST"])
def login():
    if session.get('logged_in'):
        flash('Already logged in', 'info')
        return redirect(url_for('main.index'))

    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        username = form.username.data
        password = form.password.data

        user = authenticate_user(username, password, get_db('users.db'))

        if user:
            session['logged_in'] = True
            session['username'] = user['username']
            session['usertype'] = user['usertype']

            flash(f"Logged in as {user['username']}", 'success')
            if user['usertype'] == 'Admins':
                flash("You have admin privileges", 'success')
            return redirect(url_for('main.index'))
        else:
            flash('Invalid username or password', 'danger')
            return redirect(url_for('main.index'))

    return render_template('login.html.j2', form=form)

# Logout
@auth_bp.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('main.index'))


# Change password
@auth_bp.route('/change-pwd', methods=["GET", "POST"])
@is_logged_in
def change_pwd():
    username = session['username']
    form = ChangePwdForm(request.form)
    if request.method == 'POST' and form.validate():
        conn = get_db('users.db')  # Use get_db()
        user = pd.read_sql_query(f"SELECT * FROM users WHERE username = '{username}';", conn)
        password = user.password[0]
        current = form.current.data
        if sha256_crypt.verify(current, password):
            user.password = sha256_crypt.hash(str(form.new.data))
            sql = "UPDATE users SET password = ? WHERE username = ? ;"
            cur = conn.cursor()
            cur.execute(sql, (user.password[0], str(username)))
            conn.commit()
            flash('Password changed', 'success')
            return redirect(url_for('auth.change_pwd'))
        else:
            flash('Current password incorrect', 'danger')
            return redirect(url_for('auth.change_pwd'))
    
    return render_template('change-pwd.html.j2', form=form)

@auth_bp.route('/admin/users', methods=['GET', 'POST'])
@is_logged_in_as_admin
def ViewOrAddUsers():
    connuser = get_db('users.db')  

    df = pd.read_sql_query("SELECT * FROM users;", connuser)
    df['password'] = '********'

    u2r = pd.read_sql_query("SELECT * FROM users_roles;", connuser)
    roles = pd.read_sql_query("SELECT * FROM roles;", connuser)

    # Ensure group_id columns are of the same type
    
    u2r['group_id'] = u2r['group_id'].astype(int)
    roles['group_id'] = roles['group_id'].astype(int)
    usersandroles = pd.concat([df.set_index('id'), u2r.set_index('id')], axis=1, join='outer').reset_index()
    # Merge users_roles with roles to get role names
   
    
    del u2r['group_id']

    
    usersandroles.rename(columns={'group_id': 'Role'}, inplace=True)
    usersandroles = usersandroles.dropna(subset=['username'])

    # Format column names nicely
    colnames = [s.replace("_", " ").title() for s in usersandroles.columns.values[1:]]

    return render_template(
        'view.html.j2',
        title='Users',
        colnames=colnames,
        tableClass='Users',
        editLink="edit",
        data=usersandroles
    )


# Add entry
@auth_bp.route('/add/Users', methods=["GET", "POST"])
@is_logged_in_as_admin
def add():
    connuser = get_db('users.db')
    form = eval("UsersForm")(request.form)
    if request.method == 'POST' and form.validate():
        # Get form fields:
        # Check
        if len(str(form.password.data)) < 8:
            return flash('password must be more than 8 characters',
                         'danger')
        form.password.data = sha256_crypt.hash(str(form.password.data))
        formdata = []
        for f, field in enumerate(form):
            formdata.append(field.data)
        InsertUser(formdata[0], formdata[1], connuser)
        flash('User Added', 'success')
        return redirect(url_for('auth.add', tableClass='Users'))
    return render_template('add.html.j2', title='Add Users', tableClass='Users',
                           form=form)


# Delete entry
@auth_bp.route('/delete/<string:tableClass>/<string:id>', methods=['POST'])
@is_logged_in_as_admin
def delete(tableClass, id):
    # Retrieve DB entry:
    connuser = get_db('users.db')
    user = pd.read_sql_query("SELECT * FROM users where id = " + id + " ;",
                             connuser)
    username = user.username
    DeleteUser(username[0], connuser)
    flash('User Deleted', 'success')
    return redirect(url_for('ViewOrAddUsers'))


# Access settings for a given user
@auth_bp.route('/access/<string:id>', methods=['GET', 'POST'])
@is_logged_in_as_admin
def access(id):
    connuser = get_db('users.db')
    form = AccessForm(request.form)
    form.Role.choices = table_list('roles', 'name', connuser)[1:]
    # Retrieve user DB entry:
    user = pd.read_sql_query("SELECT * FROM users where id = " + id + " ;",
                             connuser)
    if user.empty:
        abort(404)
    # Retrieve all current role
    u2r = pd.read_sql_query("SELECT * FROM users_roles WHERE id = " + id +
                            ";", connuser)
    gid = u2r.group_id[0]
    current_role = pd.read_sql_query("SELECT * FROM roles WHERE group_id = "
                                     + str(gid) + ";", connuser)
    # If user submits edit entry form:
    if request.method == 'POST' and form.validate():
        new_role = form.Role.data
        AssignRole(user.username[0], new_role, connuser)
        # Return with success
        flash('Edits successful', 'success')
        return redirect(url_for('ViewOrAddUsers'))
    # Pre-populate form fields with existing data:
    form.username.render_kw = {'readonly': 'readonly'}
    form.username.data = user.username[0]
    form.Role.data = current_role.name[0]
    return render_template('access.html.j2', form=form, id=id)