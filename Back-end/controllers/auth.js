const db = require('../modules/db');
const createToken = require('../modules/createToken');

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

exports.adminLogin = (req, res, next) => {

  const sql = `SELECT * FROM user WHERE username="${req.body.username}" AND isAdmin=1`;

  const checkPassword = async (user) => {
    if (user.length == 0) throw new Error("invalid credential");

    user = user[0];
    if (!await bcrypt.compare(req.body.password, user.password)) throw new Error("incorrect password");
    return user;
  }

  const respond = (user) => {
    res.json({
      message: "admin successfully logged in",
      token: createToken(user),
    });
  }

  db.promise(sql)
    .then(checkPassword)
    .then(respond)
    .catch(next);
}

exports.userLogin = (req, res, next) => {

  const sql = `SELECT * FROM user WHERE email="${req.body.email}" AND isAdmin=0`;

  const checkPassword = async (user) => {
    if (user.length == 0) throw new Error("email doens't exist");

    user = user[0];
    if (!await bcrypt.compare(req.body.password, user.password)) throw new Error("incorrect password");
    return user;
  }

  const respond = (user) => {
    res.json({
      message: "user successfully logged in",
      token: createToken(user),
      id: user.id
    });
  }

  db.promise(sql)
    .then(checkPassword)
    .then(respond)
    .catch(next);
}

exports.register = (req, res, next) => {

  const getUserSQL = async() => {
    const sql = `INSERT INTO user(username, email, password) values("${req.body.username}", "${req.body.email}", "${await bcrypt.hash(req.body.password, SALT_WORK_FACTOR)}")`;
    return sql;
  }

  const respond = (result) => {
    res.json({ message: "user successfully created" });
  }

  getUserSQL().then(db.promise)
               .then(respond)
               .catch(next);
}
