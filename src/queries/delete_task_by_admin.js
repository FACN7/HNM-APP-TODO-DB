const dbConnection = require("../database/db_connection");

//when the admin wants to delete task 
const delete_task_by_admin = (content, cb) => {
    dbConnection.query(
        `delete from tasks where content like '${content}' `,
        (err, res) => {
            if (err) return cb(err);
            console.log("res.rows=:", res.rows);
            cb(null, res.rows);
        }
    );
}

module.exports = delete_task_by_admin;