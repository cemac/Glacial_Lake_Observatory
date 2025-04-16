from flask import Blueprint, render_template, flash, redirect, url_for, request, abort,session
import pandas as pd
from passlib.hash import sha256_crypt
from GloApp.decorators import is_logged_in_as_admin
from GloApp.forms import Users_Form, AccessForm
from GloApp.helpers.db_helps import get_db
from GloApp.auth import InsertUser, DeleteUser, AssignRole, table_list
import os

admin_bp = Blueprint('admin', __name__, template_folder='../templates')


@admin_bp.route('/admin/information', methods=['GET', 'POST'])
@is_logged_in_as_admin
def admininfo():
    return render_template(
        'admininfo.html.j2',
        cometmail=os.environ['mailusername'],
        cometpassword=os.environ['mailpassword']
    )


@admin_bp.route('/admin/users', methods=['GET', 'POST'])
@is_logged_in_as_admin
def view_or_add_users():
    connuser = get_db('user.db')
    df = pd.read_sql_query("SELECT * FROM users ;", connuser)
    df['password'] = '********'

    u2r = pd.read_sql_query("SELECT * FROM users_roles ;", connuser)
    roles = pd.read_sql_query("SELECT * FROM roles ;", connuser)
    u2r2 = pd.merge(u2r, roles, on='group_id')
    del u2r2['group_id']
    usersandroles = pd.merge(df, u2r2, on='id', how='outer')
    usersandroles.rename(columns={'name': 'Role'}, inplace=True)
    usersandroles = usersandroles.dropna(subset=['username'])
    colnames = [s.replace("_", " ").title() for s in usersandroles.columns.values[1:]]

    return render_template(
        'view.html.j2',
        title='Users',
        colnames=colnames,
        tableClass='Users',
        editLink="edit",
        data=usersandroles
    )


@admin_bp.route('/add/Users', methods=["GET", "POST"])
@is_logged_in_as_admin
def add_user():
    form = Users_Form(request.form)
    if request.method == 'POST' and form.validate():
        if len(str(form.password.data)) < 8:
            flash('Password must be more than 8 characters', 'danger')
            return redirect(url_for('admin.add_user'))

        form.password.data = sha256_crypt.hash(str(form.password.data))
        formdata = [field.data for field in form]
        InsertUser(formdata[0], formdata[1], get_db('user.db'))
        flash('User Added', 'success')
        return redirect(url_for('admin.add_user'))

    return render_template(
        'add.html.j2',
        title='Add Users',
        tableClass='Users',
        form=form
    )


@admin_bp.route('/delete/<string:tableClass>/<string:id>', methods=['POST'])
@is_logged_in_as_admin
def delete_user(tableClass, id):
    connuser = get_db('users.db')
    user = pd.read_sql_query("SELECT * FROM users WHERE id = ?", connuser, params=(id,))
    if user.empty:
        abort(404)
    username = user.username[0]
    DeleteUser(username, connuser)
    flash('User Deleted', 'success')
    return redirect(url_for('admin.view_or_add_users'))


@admin_bp.route('/access/<string:id>', methods=['GET', 'POST'])
@is_logged_in_as_admin
def access(id):
    connuser = get_db('users.db')
    form = AccessForm(request.form)
    form.Role.choices = table_list('roles', 'name', connuser)[1:]

    user = pd.read_sql_query("SELECT * FROM users WHERE id = ?", connuser, params=(id,))
    if user.empty:
        abort(404)

    u2r = pd.read_sql_query("SELECT * FROM users_roles WHERE id = ?", connuser, params=(id,))
    gid = u2r.group_id[0]
    current_role = pd.read_sql_query("SELECT * FROM roles WHERE group_id = ?", connuser, params=(gid,))

    if request.method == 'POST' and form.validate():
        new_role = form.Role.data
        AssignRole(user.username[0], new_role, connuser)
        flash('Edits successful', 'success')
        return redirect(url_for('admin.view_or_add_users'))

    form.username.render_kw = {'readonly': 'readonly'}
    form.username.data = user.username[0]
    form.Role.data = current_role.name[0]
    return render_template('access.html.j2', form=form, id=id)


