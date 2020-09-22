BEGIN;

TRUNCATE
    users,
    incidents,
    employees
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd, email)
VALUES
    ('joeb', 'joebpassword', 'joeb@email.com'),
    ('josht', 'joshtpassword', 'josht@email.com');

INSERT INTO incidents (title, comments, users_id, inc_pri, office_location)
VALUES
    ('software', 'need update', '1', 'Low', 'Bremerton'),
    ('hardware', 'camera does work', '2', 'MED', 'Bremerton'),
    ('other', 'displays are not showing up', '1', 'High', 'Camp Murray'),
    ('software', 'need sketch software', '1', 'High', 'Camp Murray'),
    ('hardware', 'need a mobile phone', '2', 'MED', 'Renton');

INSERT INTO employees (fname, lname, email, emp_address, emp_st, emp_zip, office_location, emp_roles)
VALUES
    ('jack', 'state', 'jackstate@email.com', '830 armor drive', 'WA', '98430', 'Camp Murray', 'Admin'),
    ('jason', 'borne', 'jasonborne@email.com', '123 street drive', 'WA', '98337', 'Bremerton', 'Tech');

COMMIT;