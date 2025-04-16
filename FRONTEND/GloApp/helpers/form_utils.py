import pandas as pd

def yesno_list():
    return [('blank', '--Please select--'), ('Yes', 'Yes'), ('No', 'No')]

def yn_list():
    return [('blank', '--Please select--'), ('Y', 'Yes'), ('N', 'No')]

def subject_list():
    return [('blank', '--Please select--'), ('request access', 'request access'),
            ('general question', 'general question'), ('contributor query', 'contributor query'),
            ('other', 'other')]

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