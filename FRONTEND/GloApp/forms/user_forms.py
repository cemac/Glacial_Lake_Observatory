from wtforms import Form, StringField, PasswordField, TextAreaField, SelectField, SelectMultipleField, validators, widgets
from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, Email
from GloApp.helpers.form_utils import job_list, yesno_list, role_list

class UsersForm(FlaskForm):
    username = StringField('* Username', [validators.Length(min=4, max=25)])
    password = PasswordField('* Password', [validators.Regexp('^([a-zA-Z0-9]{8,})$', message="Password must be minimum 8 characters...")])
    role_request = SelectField('Access level Request', choices=[], validators=[validators.Optional()])
    affiliation = StringField('Affiliation', [validators.Optional()])
    email = StringField('* Email', [DataRequired(), Email(message='Invalid email')])   
    consent = SelectField('* Consent', [DataRequired()], choices=[])
    country = StringField('Country', [validators.Optional()])
    job_type = SelectField('Job Type', choices=[], validators=[validators.Optional()])
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.job_type.choices = job_list()
        self.consent.choices = yesno_list()
        self.role_request.choices = role_list()


class ChangePwdForm(FlaskForm):
    current = PasswordField('Current password', [validators.DataRequired()])
    new = PasswordField('New password', [validators.Regexp('^([a-zA-Z0-9]{8,})$', message="Password must be minimum 8 characters...")])
    confirm = PasswordField('Confirm new password', [validators.EqualTo('new', message='Passwords do not match')])

class MultiCheckboxField(SelectMultipleField):
    widget = widgets.ListWidget(prefix_label=False)
    option_widget = widgets.CheckboxInput()

class AccessForm(FlaskForm):
    username = StringField('Username')
    Role = SelectField('Role', [validators.NoneOf(('blank'), message='Please select')])

class ContactForm(FlaskForm):
    name = StringField('Name', [validators.InputRequired()])
    email = StringField('Email')
    subject = SelectField('Subject', [validators.Optional()])
    message = TextAreaField('Message', [validators.Optional()])

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

class Contact_Form(FlaskForm):
    name = StringField(u'Name', [validators.InputRequired()],
                       render_kw={"placeholder": "Name"})
    email = StringField(u'Email',
                        render_kw={"placeholder": "Required if reply needed"})
    subject = SelectField(u'Subject', [validators.Optional()])
    message = TextAreaField(u'Message', [validators.Optional()],
                            render_kw={"placeholder": "Enter Message Here"})