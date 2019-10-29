const dbConnection = require("../database/db_connection");

//Insert new task
const add_user = (user_name, password, cb) => {
    dbConnection.query(
        "INSERT INTO users (user_name,password)VALUES($1,$2)",
        [user_name, password],
        (err, res) => {
            if (err) return cb(err);
            console.log("res.rows=:", res.rows);
            cb(null, res.rows);
        }
    );
}

module.exports = add_user;