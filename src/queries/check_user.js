const dbConnection = require("../database/db_connection");

const check_user = (user, password, cb) => {
  dbConnection.query(
    `select * from users where user_name like '${user}' and password like '${password}'`,
    (err, res) => {
      if (err) return cb(err);
      console.log("res.rows=:", res.rows);
      cb(null, res.rows);
    }
  );
};

module.exports = check_user;
