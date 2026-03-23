import json
import os

from flask import Blueprint, render_template, request, flash, redirect, url_for, abort
from GloApp.forms.user_forms import Contact_Form
from flask_mail import Message
from GloApp.extensions import mail
import GloApp.globals
main_bp = Blueprint('main', __name__, template_folder='../templates')

@main_bp.route('/')
def index():
    return render_template('home.html.j2')

@main_bp.route('/contact', methods=["GET", "POST"])
def contact():
    form = Contact_Form(request.form)
    form.subject.choices = [(s, s) for s in ["Bug", "Suggestion", "Help"]]  # Replace with real subject_list()
    if request.method == 'POST' and form.validate():
        formdata = [field.data for field in form]
        try:
            msg = Message(
                f"{formdata[0]} [{formdata[2]}]",
                sender=os.environ['mailusername'],
                recipients=[formdata[1], os.environ['mailusername']]
            )
            msg.body = formdata[3] + '\n\n(Forwarding to appropriate emails not yet set up)'
            mail.send(msg)
        except Exception as e:
            flash(str(e), 'danger')
        flash('Message sent', 'success')
        return redirect(url_for('main.contact'))
    return render_template('contact.html.j2', title='Contact Form', form=form)

# Static pages mapping
static_pages = {
    'about/project': 'about-project.html.j2',
    'about/team': 'about-team.html.j2',
    'about/whatwedo': 'about-whatwedo.html.j2',
    'about/feedback': 'about-feedback.html.j2',
    'contribute': 'contributor_guidelines.html.j2',
    'resources/publications': 'publications.html.j2',
    'resources/training': 'training.html.j2',
    'resources/multimedia': 'multimedia.html.j2',
    'news': 'news.html.j2',
    'glossary': 'glossary.html.j2',
    'copyright': 'copyright.html.j2',
    'privacy': 'privacy.html.j2',
}

@main_bp.route('/<path:page>')
def render_static_page(page):
    if page in static_pages:
        return render_template(static_pages[page])
    abort(404)

@main_bp.route('/database')
def database():
    try:
        lakes = GloApp.globals.LAKES
    except:
        lakes = []
    return render_template('database.html.j2', lakes=lakes)

@main_bp.route('/database/search')
def search():
    return render_template('db-search.html.j2')

@main_bp.route('/database/lake/<string:lake_id>')
def lake(lake_id):
    if lake_id not in GloApp.globals.LAKES_BY_ID.keys():
        return render_template('404.html.j2'), 404
    try:
        lakes = GloApp.globals.LAKES_BY_ID
        lake_data = lakes[lake_id]
    except:
        lake_data = {}
    return render_template('lake.html.j2', lake_id=lake_id, lake_data=lake_data)

@main_bp.route('/database/lake-data/<string:lake_id>')
def lakedata(lake_id):
    return render_template('lake-data.html.j2', lake_id=lake_id)

@main_bp.route('/database/otherdata/')
def otherdata():
    
    return render_template('otherdata.html.j2')
