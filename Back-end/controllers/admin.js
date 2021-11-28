const db = require('../modules/db');

exports.getStats = (req, res, next) => {
  const sql = `SELECT * FROM stats`;

  const respond = (result) => {
    res.json({stats: result});
  }

  db.promise(sql)
    .then(respond)
    .catch(next);
}
