from flask import Blueprint, render_template, session, redirect, url_for, flash, request
import pandas as pd
import os
from passlib.hash import sha256_crypt
from app.decorators import is_logged_in
from app.forms import ChangePwdForm
from app.db import get_user_db

account_bp = Blueprint('account', __name__, template_folder='../templates')


@account_bp.route('/change-pwd', methods=["GET", "POST"])
@is_logged_in
def change_pwd():
    username = session['username']
    connuser = get_user_db()
    form = ChangePwdForm(request.form)

    if request.method == 'POST' and form.validate():
        user = pd.read_sql_query("SELECT * FROM users WHERE username = ?;", connuser, params=(username,))
        if user.empty:
            flash('User not found.', 'danger')
            return redirect(url_for('account.change_pwd'))

        password_hash = user.password[0]
        current = form.current.data

        if sha256_crypt.verify(current, password_hash):
            new_password = sha256_crypt.hash(str(form.new.data))
            sql = "UPDATE users SET password = ? WHERE username = ?;"
            connuser.execute(sql, (new_password, username))
            connuser.commit()
            flash('Password changed', 'success')
        else:
            flash('Current password incorrect', 'danger')

        return redirect(url_for('account.change_pwd'))

    return render_template('change-pwd.html.j2', form=form)


@account_bp.route('/account/<string:username>', methods=['GET', 'POST'])
@is_logged_in
def account(username):
    role = session.get('usertype', 'Unknown')
    return render_template(
        'account.html.j2',
        username=username,
        Role=role,
        glomail=os.environ.get('mailusername'),
        glopassword=os.environ.get('mailpassword')
    )