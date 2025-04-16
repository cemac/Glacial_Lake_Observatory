from flask import Blueprint, render_template, request, flash, redirect, url_for
from GloApp.forms.user_forms import ContactForm
from flask_mail import Message
from GloApp.extensions import mail
import os
main_bp = Blueprint('main', __name__, template_folder='../templates')


@main_bp.route('/')
def index():
    return render_template('home.html.j2')


@main_bp.route('/about/project')
def about():
    return render_template('about-project.html.j2')


@main_bp.route('/about/team')
def about_team():
    return render_template('about-team.html.j2')


@main_bp.route('/about/feedback')
def about_feedback():
    return render_template('about-feedback.html.j2')


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


@main_bp.route('/contribute')
def contribute():
    return render_template('contributor_guidelines.html.j2')


@main_bp.route('/resources/publications')
def publications():
    return render_template('publications.html.j2')


@main_bp.route('/resources/training')
def training():
    return render_template('training.html.j2')


@main_bp.route('/resources/multimedia')
def multimedia():
    return render_template('multimedia.html.j2')


@main_bp.route('/news')
def news():
    return render_template('news.html.j2')


@main_bp.route('/glossary')
def glossary():
    return render_template('glossary.html.j2')


@main_bp.route('/copyright')
def copyright():
    return render_template('copyright.html.j2')


@main_bp.route('/privacy')
def privacy():
    return render_template('privacy.html.j2')