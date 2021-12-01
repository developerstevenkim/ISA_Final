const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const resource = '';
const db = require('./modules/db');

const authController = require('./controllers/auth');
const adminController = require('./controllers/admin');


const createToken = require('./modules/createToken');
const decodeToken = require('./modules/decodeToken');
const errorHandler = require('./modules/errorHandler');
const recordStats = require('./modules/recordStats');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // TODO: after deploying the program, set the access-control-allow-origin to exact value and replace below lines with next();
    if (req.method == "OPTIONS") res.status(200).send();
    else next();
});

// middleware to record every stats
app.use(recordStats);

// middleware to check Authorization token passed in header
app.use('/admins', decodeToken);
app.use('/users', decodeToken);

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.code && (err.code >= 100 && err.code < 600) ? err.code : 400;
  res.status(statusCode)
    .json({
      message: err.message
    });
})


app.post('/adminLogin', authController.adminLogin);
app.get('/admins/stats', adminController.getStats);

app.post('/login', authController.userLogin);
app.post('/register', authController.register);

app.use(errorHandler);

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("listening to port", PORT);
});
