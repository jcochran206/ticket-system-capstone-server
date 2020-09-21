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

INSERT INTO incidents (title, comments, user_id, inc_pri, Office_Loc)
VALUES
    ('software', 'need update', '1', 'Low', 'Bremerton'),
    ('hardware', 'camera does work', '2', 'Med', 'Bremerton'),
    ('other', 'displays are not showing up', '3', 'High', 'Camp Murray'),
    ('software', 'need sketch software', '1', 'High', 'Camp Murray'),
    ('hardware', 'need a mobile phone', '2', 'Med', 'Renton')

INSERT INTO employees ()
COMMIT;