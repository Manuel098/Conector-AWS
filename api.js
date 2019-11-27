'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app=express();

const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE =process.env.PRODUCTS_TABLE;
// Routes
const users = require('./routes/user'); 

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', users);

module.exports = app;
