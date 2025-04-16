import os
import sqlite3
import pandas as pd
from flask import g, current_app


# ---------------------------- DB Connection ---------------------------- #

def get_db(database):
    if 'db' not in g:
        db_path = os.path.join(current_app.instance_path, database)
        db_path = os.path.abspath(db_path)
        print("DB:", db_path)
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# ---------------------------- Query Helpers ---------------------------- #

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else (rv if rv else None)

# ---------------------------- User Functions ---------------------------- #

def insert_user(username, password):
    conn = get_db('users.db')
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()


def retrieve_users():
    cur = get_db('users.db').cursor()
    cur.execute("SELECT id, username, password FROM users")
    return cur.fetchall()

# ---------------------------- Edit Functions ---------------------------- #

def edit_row(table, id, colname, value,db):
    cur = get_db(db).cursor()
    sql = f"UPDATE {table} SET '{colname}' = ? WHERE id = ?"
    cur.execute(sql, (str(value), str(id)))
    get_db().commit()


def add_row(table, df,db):
    df.to_sql(table, con=get_db(db), index=False, if_exists='append')


def add_row_edits(table, df,db):
    conn = get_db(db)
    id = df.ID.values[0]
    cur = conn.cursor()
    cur.execute("DELETE FROM gloDB1_edits WHERE ID = ?", (id,))
    conn.commit()
    df.to_sql(table, con=conn, index=False, if_exists='append')


def delete_glo_edit(id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM gloDB1_edits WHERE id = ?", (id,))
    conn.commit()
    cur.execute("UPDATE gloDB1 SET 'Review needed' = 'N' WHERE id = ?", (id,))
    conn.commit()


def accept_glo_edit(id):
    conn = get_db()
    df_edits = pd.read_sql_query("SELECT * FROM gloDB1_edits WHERE ID = ?", conn, params=(id,))
    df_edits['Review needed'] = 'N'
    df_edits.fillna('Unknown', inplace=True)
    if df_edits.country.values[0] == '':
        df_edits['country'] = 'Unknown'
    if df_edits.Area.values[0] == '':
        df_edits['Area'] = 'Unknown'
    cur = conn.cursor()
    cur.execute("DELETE FROM gloDB1 WHERE id = ?", (id,))
    conn.commit()
    df_edits.to_sql('gloDB1', con=conn, index=False, if_exists='append')
    cur.execute("DELETE FROM gloDB1_edits WHERE id = ?", (id,))
    conn.commit()


def delete_glo(id):
    cur = get_db().cursor()
    cur.execute("DELETE FROM gloDB1 WHERE id = ?", (id,))
    get_db().commit()
