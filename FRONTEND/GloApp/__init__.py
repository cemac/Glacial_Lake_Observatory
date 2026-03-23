import json
import os

from flask import Flask
from flask_mail import Mail
from .extensions import mail
from .routes.main import main_bp
from .routes.auth import auth_bp
from GloApp.helpers.db_helpers import close_db
import GloApp.globals
from .config import Config  # assuming you have this defined somewhere
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # --- global variables
    site_root = os.path.realpath(app.root_path)
    lakes_json = os.sep.join([site_root, '..', 'data', 'lakes.json'])
    lakes_by_id_json = os.sep.join([site_root, '..', 'data', 'lakes_by_id.json'])
    try:
        with open(lakes_json, 'r') as json_data:
            GloApp.globals.LAKES = json.load(json_data)
    except:
        pass
    try:
        with open(lakes_by_id_json, 'r') as json_data:
            GloApp.globals.LAKES_BY_ID = json.load(json_data)
    except:
        pass
    # ---

    mail.init_app(app)

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    

    app.teardown_appcontext(close_db)

    register_error_handlers(app)

    return app

def register_error_handlers(app):
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html.j2'), 404

    @app.errorhandler(403)
    def forbidden(e):
        return render_template('403.html.j2'), 403

    @app.errorhandler(500)
    def internal_error(e):
        app.logger.error(f"Server Error: {e}")
        return render_template('500.html.j2'), 500

    @app.errorhandler(Exception)
    def unhandled_exception(e):
        app.logger.error(f"Unhandled Exception: {e}")
        return render_template('500.html.j2'), 500
