BEGIN TRANSACTION;

CREATE TABLE meetings(
    id serial PRIMARY KEY,
    event_name VARCHAR(150) UNIQUE NOT NULL,
    no_of_people INT UNIQUE NOT NULL,
    date_recorded TIMESTAMP NOT NULL,
    user_id FOREIGN KEY REFERENCES users(id)
);

COMMIT;