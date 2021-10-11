BEGIN TRANSACTION;

CREATE TABLE meetings(
    id serial PRIMARY KEY,
    event_name text UNIQUE NOT NULL,
    no_of_people BIGINT NOT NULL,
    location text NOT NULL,
    date_recorded TIMESTAMP NOT NULL,
    user_id INT REFERENCES users(id)
);

COMMIT;