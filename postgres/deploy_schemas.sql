-- Deploy database tables-execute the sql create tables scripts 

\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- Add dummy/seed data to tables
\i '/docker-entrypoint-initdb.d/seed/seed.sql'