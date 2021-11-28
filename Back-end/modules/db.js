const mysql = require('mysql');

//Create connection to db
const db = mysql.createConnection({
    host: "localhost",
    user: "msvaolcz_anmolS",
    password: "Mysqldatabase123",
    database: "msvaolcz_aDatabase",
    multipleStatements: true,
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to mysql");
});

db.promise = (sql) => {
  return new Promise((res, rej) => {
    db.query(sql, (err, result) => {
      if (err) rej(err);
      else res(result);
    })
  })
}

module.exports = db;
