const fs = require('fs');
const path = require('path');

const dbConnection = require('./db_connection.js');

const sqlPath = path.join(__dirname, 'db_build.sql');
const sql = fs.readFileSync(sqlPath).toString();

// const runDbBuild = cb => {dbConnection.query(sql, cb)
// console.log("abc")
// }
// module.exports = runDbBuild
dbConnection.query(sql, (err, result) => {
    if (err) {
        console.log(err, "error");
    } else {
        console.log("database created");
        dbConnection.end(() => {
            console.log('connection closed')
        })
    }
});