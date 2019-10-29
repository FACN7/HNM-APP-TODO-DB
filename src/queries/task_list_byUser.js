const dbConnection = require("../database/db_connection");

//show the list of tasks of specific user
const task_list_byUser = (cb) => {
    dbConnection.query(
        `select content from tasks where user_id=${user_id}`,
        (err, res) => {
            if (err) return cb(err);
            console.log("res.rows=:", res.rows);
            cb(null, res.rows);
        }
    );
}

module.exports = task_list_byUser;