const db = require('../modules/db');

const recordStats = (req, res, next) => {
  // check if endpoint exists in config file
  // TODO: put all const endpoints in config file
  const getSQL = `SELECT * FROM stats WHERE method = "${req.method}" AND endpoint = "${req.path}"`;

  const checkStatExists = (result) => {
    if (result.length == 1) return result;
    const createSQL = `INSERT INTO stats(method,endpoint) values("${req.method}","${req.path}")`;
    return db.promise(createSQL);
  }

  const incrementStat = (result) => {
    const id = result[0] ? result[0].id : result.insertId;
    const incrementSQL = `UPDATE stats SET count = count + 1 WHERE id = "${id}"`;
    return db.promise(incrementSQL);
  }

  db.promise(getSQL)
    .then(checkStatExists)
    .then(incrementStat)
    .then(result => next());

}

module.exports = recordStats;
