
from flask import Blueprint, render_template, flash, redirect, url_for, request, session, g
from GloApp.helpers.db_helpers import get_db  # Make sure to import get_db
from GloApp.forms.user_forms import LoginForm, ChangePwdForm, ContactForm
from GloApp.helpers.auth_helpers import authenticate_user
from GloApp.decorators.auth_decorators import is_logged_in, is_logged_in_as_admin
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
