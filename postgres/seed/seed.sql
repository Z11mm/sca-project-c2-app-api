BEGIN TRANSACTION;

INSERT into users(name, email, department, title, joined) values('admin', 'admin@admin.com', 'hr', 'assistant', '2021-01-01');
INSERT into login(hash, email) values('$2a$10$fWgWvbkK4s7vaOgb.wNfgOaFi4m84Wt.ljOz4JTedRIs2U4mAZC32', 'admin@admin.com');

COMMIT;