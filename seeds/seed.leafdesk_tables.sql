BEGIN;

TRUNCATE
    users,
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd)
VALUES
    ('joeb', 'joebpassword'),
    ('josht', 'joshtpassword');

COMMIT;