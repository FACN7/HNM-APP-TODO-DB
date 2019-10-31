const dbConnection = require("../database/db_connection");

//Update task when the user press on button for taking the task
const update_task_to_done = (content, user_id, cb) => {
  dbConnection.query(
    `UPDATE tasks SET user_id =${user_id} , task_done = true where content like '${content}' `,
    (err, res) => {
      if (err) return cb(err);
      console.log("res.rows=:", res.rows);
      cb(null, res.rows);
    }
  );
};

module.exports = update_task_to_done;
