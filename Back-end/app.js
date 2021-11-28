const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 8888;
const app = express();
const resource = '/Quiz/API/V1';

const authController = require('./controllers/auth');
const adminController = require('./controllers/admin');
const decodeToken = require('./modules/decodeToken');
const errorHandler = require('./modules/errorHandler');
const recordStats = require('./modules/recordStats');

app.use(function (req, res, next) {
    //TODO:  below code needs to be changed to https://lab5.live/ at the end
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// middleware to record every stats
app.use(recordStats);

const db = mysql.createConnection({
    host: "localhost",
    user: "msvaolcz_anmolS",
    password: "Mysqldatabase123",
    database: "msvaolcz_aDatabase"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

// ********************************************************
// GET request (url : https://lab5.live/Quiz/API/V1/ )
// ********************************************************
app.get(resource, (req, res) => {
    let sqlQuery = `SELECT * FROM test`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(`${JSON.stringify(result)}`);
    });
});

// ********************************************************
// GET request (url : https://lab5.live/Quiz/API/V1/id )
// ********************************************************
app.get(`${resource}/:id`, async (req, res) => {
    const {
        id
    } = req.params;
    let sqlQuery = `SELECT * FROM test WHERE id=${id}`;
    console.log(sqlQuery);
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.status(200).send(result);
    });
})

// ********************************************************
// DELETE request (url : https://lab5.live/Quiz/API/V1/ )
// ********************************************************
app.delete(`${resource}`, (req, res) => {
    const sqlQuery = `DELETE FROM test`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

// ********************************************************
// DELETE request (url : https://lab5.live/Quiz/API/V1/id )
// ********************************************************
app.delete(`${resource}/:id`, (req, res) => {
    const {
        id
    } = req.params;
    const sqlQuery = `DELETE FROM test WHERE id='${id}'`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

// ********************************************************
// POST request (url : https://lab5.live/Quiz/API/V1/ )
// id is auto incremented
// ********************************************************
app.post(resource, (req, res) => {
    let body = "";
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    });
    req.on('end', function () {
        let output = JSON.parse(body);
        const sqlQuery = `INSERT INTO test (question, option1, option2, option3, option4, answer) VALUES
                         ('${output.question}', '${output.option1}', '${output.option2}', '${output.option3}', '${output.option4}', '${output.answer}')`;
        db.query(sqlQuery, (sqlErr, sqlRes) => {
            if (sqlErr) {
                res.status(404).send(`Question ${output.question} is stored in DB`);
                throw sqlErr;
            };
            res.status(200).send(output);
        });
    });
});

// ********************************************************
// PUT request (url : https://lab5.live/Quiz/API/V1/id )
// ********************************************************
app.put(`${resource}/:id`, async (req, res) => {
    let body = "";
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    });
    req.on('end', function () {
        let output = JSON.parse(body);
        const sqlQuery = `UPDATE test SET option1 = '${output.option1}', option2 = '${output.option2}', option3 = '${output.option3}', option4 = '${output.option4}' WHERE id=${req.params.id}`;
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            }
            res.status(200).send(`Question ${output.question} is updated on DB`);
        });
    });
})

// middleware to check Authorization token passed in header
app.use(resource + '/admins', decodeToken);
app.use(resource + '/users', decodeToken);

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.code && (err.code >= 100 && err.code < 600) ? err.code : 400;
  res.status(statusCode)
    .json({
      message: err.message
    });
})

app.post(resource + '/adminLogin', authController.adminLogin);
app.get(resource + '/admins/stats', adminController.getStats);

app.post(resource + '/login', authController.userLogin);
app.post(resource + '/register', authController.register);

app.use(errorHandler);

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
});