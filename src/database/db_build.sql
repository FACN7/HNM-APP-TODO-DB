
BEGIN;

    CREATE TABLE users
    (
        user_id serial PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL
    )

    CREATE TABLE tasks
    (
        task_id serial PRIMARY KEY,
        content VARCHAR(500) NOT NULL,
        user_id int,
        task_taken boolean DEFAULT FALSE,
        task_done boolean DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )


    COMMIT;