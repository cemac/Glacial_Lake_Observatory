create table users_roles (
id integer,
group_id integer,
PRIMARY KEY (id, group_id),
CONSTRAINT user_id
FOREIGN KEY (id) REFERENCES users (id)
ON DELETE CASCADE ON UPDATE NO ACTION,
CONSTRAINT role_id
FOREIGN KEY (group_id) REFERENCES roles (group_id)
ON DELETE CASCADE ON UPDATE NO ACTION
);

create table users (
id integer primary key autoincrement,
username text not null,
password text not null,
email text,
affiliation text,
consent text,
country text,
job_type text
);

create table roles (
group_id integer PRIMARY KEY,
name text NOT NULL
);

INSERT INTO roles (group_id, name) VALUES
(1, 'Registered_Users'),
(2, 'Collaborators'),
(3, 'Admins'),
(4, 'Reviewers');