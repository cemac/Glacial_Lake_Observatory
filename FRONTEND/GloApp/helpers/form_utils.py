import pandas as pd

def yesno_list():
    return [('blank', '--Please select--'), ('Yes', 'Yes'), ('No', 'No')]

def yn_list():
    return [('blank', '--Please select--'), ('Y', 'Yes'), ('N', 'No')]

def subject_list():
    return [('blank', '--Please select--'), ('request access', 'request access'),
            ('general question', 'general question'), ('contributor query', 'contributor query'),
            ('other', 'other')]

def table_list(tableClass, col, conn):
    DF = pd.read_sql_query("SELECT * FROM roles ;", conn)
    list = [('blank', '--Please select--')]
    for element in DF[col]:
        list.append((element, element))
    return list

def option_list(col_name, conn):
    list = [('blank', '--Please select--')]
    if col_name == 'country':
        df = pd.read_sql_query(f"SELECT {col_name}, Area FROM VolcDB1;", conn)
    else:
        df = pd.read_sql_query(f"SELECT {col_name} FROM VolcDB1;", conn)

    existing = df.drop_duplicates().dropna().sort_values('Area')
    existing = existing[~existing.Area.str.contains('0')]

    if col_name == 'country':
        existing = existing[~existing.country.str.contains('161.08')]
        for _, row in existing.iterrows():
            list.append((row[0], f"{row[0]} ({row[1]})"))
    else:
        for _, row in existing.iterrows():
            list.append((row[0], row[0]))

    list.append(('other', 'other --Please Specify--'))
    return list

def subject_list():
    return [
        ("blank", "--Please select--"),
        ("request access", "request access"),
        ("general question", "general question"),
        ("contributor query", "contributor query"),
        ("other", "other"),
    ]

def job_list():
    """generate job list for forms
    """
    list = []
    list.append(('blank', '--Please select--'))
    list.append(('Academic (undergraduate student)', 'Academic (undergraduate student)'))
    list.append(('Academic (postgraduate student)', 'Academic (postgraduate student)'))
    list.append(('Academic (early career researcher/ postdoctoral)', 'Academic (early career researcher/ postdoctoral)'))
    list.append(('Academic (researcher/ tenured academic)', 'Academic (researcher/ tenured academic)'))
    list.append(('Government/ Public Sector', 'Government/ Public Sector'))
    list.append(('Business/ Private Sector', 'Business/ Private Sector'))
    list.append(('Development Agency/Charity', 'Development Agency/Charity'))
    list.append(('Geological/Geophysics Survey', 'Geological/Geophysics Survey'))
    list.append(('other', 'other'))
    return list


def role_list():
    """generate role list for forms
    """
    list = []
    list.append(('blank', '--Please select--'))
    list.append(('Registered_Users', 'Registered_Users'))
    list.append(('Collaborators', 'Collaborators'))
    list.append(('Reviewers', 'Reviewers'))
    return list