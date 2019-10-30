const dbConnection = require("../database/db_connection");

//show the list of tasks that belong to specific user who take the task
const task_list_byUser = (user_id, cb) => {
    dbConnection.query(
        ` select content from tasks where user_id=${user_id} and task_done =false and task_taken = true `,
        (err, res) => {
            if (err) return cb(err);
            console.log("res.rows=:", res.rows);
            cb(null, res.rows);
        }
    );
}

module.exports = task_list_byUser;