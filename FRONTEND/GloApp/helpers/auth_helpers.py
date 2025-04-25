from wtforms import Form, validators, StringField, SelectField, TextAreaField, PasswordField, SelectMultipleField, widgets
import pandas as pd
from flask import session, flash, redirect, url_for
from passlib.hash import sha256_crypt
# ------------------------------ Forms -------------------------------------- #

password_message = (
    "Password must be mimimum 8 characters and contain only "
    + "uppercase letters, lowercase letters and numbers"
)




def authenticate_user(username, password_candidate, conn):
    user = pd.read_sql_query("SELECT * FROM users WHERE username = ?", conn, params=(username,))
    
    if username == 'admin':
        if password_candidate == 'password':
            return {'username': 'admin', 'usertype': 'Admins'}
        else:
            return None

    if not user.empty:
        password = user.password[0]
        if sha256_crypt.verify(str(password_candidate), password):
            roleid = pd.read_sql_query("SELECT * FROM users_roles WHERE id = ?", conn, params=(user.id[0],))
            role = pd.read_sql_query("SELECT * FROM roles WHERE group_id = ?", conn, params=(roleid.group_id[0],))
            return {
                'username': username,
                'usertype': str(role.name[0])
            }
    return None

def InsertUser(username, password, conn):
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))  # No need to hash here
    AssignRole(username, 'Registered_Users', conn)  # Assign default role
    conn.commit()

def RegisterUser(formdata, conn):
    cur = conn.cursor()
    username = formdata[0]
    password = formdata[1]  # password already hashed
    email = formdata[4]
    affiliation = formdata[3]
    consent = formdata[5]
    country = formdata[6]
    job_type = formdata[7]
    role_request = formdata[2]
    role = 5 # awaiting approval
    cur.execute("INSERT INTO users (username, password, email, affiliation, consent, country, job_type, role_request) VALUES (?, ?,?, ?, ?, ?, ?, ?)", 
                (username, password, email, affiliation, consent, country, job_type, role_request))  # No need to hash here
    conn.commit()   
    # Get the user ID
    print("Assigning role to user")
    userid_df = pd.read_sql_query("SELECT id FROM users WHERE username = ?", conn, params=(username,))
    if userid_df.empty:
        flash("User not found", "danger")
        return

    userid = userid_df['id'].iloc[0] 
    print('User ID:', userid)
    cur.execute("INSERT INTO users_roles (id, group_id) VALUES (?, ?)", 
                (userid, role)) 
    print("Assigned role to user")
    conn.commit() 


def OptionalInfo(username, conn, affiliation=None, email=None, request=None, consent=None):
    cur = conn.cursor()
    cur.execute("INSERT INTO users (affiliation, email) VALUES (?, ?)", (str(affiliation), str(email)))
    conn.commit()

def DeleteUser(username, conn):
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()


def AssignRole(username, role, conn):
    if role not in ['Registered_Users', 'Collaborators', 'Admins', 'Reviewers', 'Awaiting approval']:
        flash('Role must be one of: Registered_Users, Reviewer, Collaborators, Admins', 'danger')
        return

    cur = conn.cursor()
    user = pd.read_sql_query("SELECT * FROM users WHERE username = ?", conn, params=(username,))
    if user.empty:
        flash('User not found', 'danger')
        return

    # Get the current role of the user
    current_role = pd.read_sql_query("SELECT * FROM users_roles WHERE id = ?", conn, params=(user['id'].values[0],))

    # Only delete and update if necessary
    if current_role.empty or current_role['group_id'].values[0] != role:
        cur.execute("DELETE FROM users_roles WHERE id = ?", (user['id'].values[0],))

        role_df = pd.read_sql_query("SELECT * FROM roles WHERE name = ?", conn, params=(role,))
        if role_df.empty:
            flash('Role not found in roles table', 'danger')
            return

        print(role_df['group_id'].iloc[0])
        #role_id = int(role_df['group_id'].iloc[0]) 
        # Insert the user and role mapping correctly
        role_id = int(role_df['group_id'].iloc[0])
        cur.execute("INSERT INTO users_roles (id, group_id) VALUES (?, ?)", (user['id'].values[0], role_id))
        conn.commit()
    else:
        flash(f'{username} already has the {role} role.', 'info')
    return