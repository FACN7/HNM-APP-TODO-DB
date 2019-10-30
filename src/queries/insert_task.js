const dbConnection = require("../database/db_connection");

//Insert new task
const check_user = (content, user_id, cb) => {
  dbConnection.query(
    "INSERT INTO tasks (content,user_id)VALUES($1,$2)",
    [content, user_id],
    (err, res) => {
      if (err) return cb(err);
      console.log("res.rows=:", res.rows);
      cb(null, res.rows);
    }
  );
};

module.exports = check_user;
