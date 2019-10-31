const dbConnection = require("../database/db_connection");

//show the list of tasks that belong to specific user who take the task
const task_list_byUser_done = cb => {
  dbConnection.query(
    ` select * from tasks where task_done =true and task_taken = true `,
    (err, res) => {
      if (err) return cb(err);
      console.log("res.rows=:", res.rows);
      cb(null, res.rows);
    }
  );
};

module.exports = task_list_byUser_done;
