from functools import wraps
from flask import session, flash, redirect, url_for

# Decorators for authentication and authorization in Flask
def is_logged_in(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorised, please login', 'danger')
            return redirect(url_for('index'))
    return decorated_function


def is_logged_in_as_editor(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' in session and session.get('usertype') in ['Collaborators', 'Reviewers', 'Admins']:
            return f(*args, **kwargs)
        else:
            flash('Unauthorised, please login as an editor/reviewer/admin', 'danger')
            return redirect(url_for('index'))
    return decorated_function


def is_logged_in_as_reviewer(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' in session and session.get('usertype') in ['Reviewers', 'Admins']:
            return f(*args, **kwargs)
        else:
            flash('Unauthorised, please login as a reviewer/admin', 'danger')
            return redirect(url_for('index'))
    return decorated_function


def is_logged_in_as_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' in session and session.get('usertype') == 'Admins':
            return f(*args, **kwargs)
        else:
            flash('Unauthorised, please login as admin', 'danger')
            return redirect(url_for('index'))
    return decorated_function
