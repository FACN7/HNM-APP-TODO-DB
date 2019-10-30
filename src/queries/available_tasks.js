const dbConnection = require("../database/db_connection");

//Show the available tasks which anybody work on them

const available_tasks = cb => {
  dbConnection.query(
    `select * from tasks where task_done = false and task_taken=false`,
    (err, res) => {
      if (err) return cb(err);
      console.log("res.rows=:", res.rows);
      cb(null, res.rows);
    }
  );
};


module.exports = available_tasks;
