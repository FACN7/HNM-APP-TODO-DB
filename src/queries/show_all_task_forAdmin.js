const dbConnection = require("../database/db_connection");

//show all the tasks content in the admin page 
const show_all_task_forAdmin = (cb) => {
    dbConnection.query(
        `select content from tasks `,
        (err, res) => {
            if (err) return cb(err);
            console.log("res.rows=:", res.rows);
            cb(null, res.rows);
        }
    );
}

module.exports = show_all_task_forAdmin;