const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 8888; 
const serverPort = 8080;
const app = express();
const resource = '/Quiz/API/V1';
const path = require('path');
const https = require('https');
const oas3Tools = require('oas3-tools');
// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};
const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const swgapp = expressAppConfig.getApp();



app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

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


app.get(resource, (req, res) => {
    let sqlQuery = `SELECT * FROM test`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(`${JSON.stringify(result)}`);
    });
});

app.delete(`${resource}/:id`, (req, res) => { 
    const {id} = req.params;
    const sqlQuery = `DELETE FROM test WHERE id='${id}'`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

app.delete(`${resource}`, (req, res) => { 
    const sqlQuery = `DELETE FROM test`;
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

app.get(`${resource}/:id`, async (req, res) => {
    const {id} = req.params;

    let sqlQuery = `SELECT * FROM test WHERE id=${id}`;
    console.log(sqlQuery);
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.status(200).send(result);
        // res.status(200).send(`${JSON.stringify(result)}`);
    });
})


app.put(`${resource}/:id`, async (req, res) => {
    let body = "";
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    });

    req.on('end', function () {
        let output = JSON.parse(body);
        const sqlQuery = `UPDATE test SET question = '${output.question}', option1 = '${output.option1}', option2 = '${output.option2}', option3 = '${output.option3}', option4 = '${output.option4}' WHERE id=${req.params.id}`;
        db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.status(200).send(`Question ${output.question} is updated on DB`);
    });
    });
    
})

// Initialize the Swagger middleware
https.createServer(swgapp).listen(serverPort, function () {
    console.log('Your server is listening on port %d (https://lab5.live:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on https://lab5.live:%d/docs', serverPort);
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
});