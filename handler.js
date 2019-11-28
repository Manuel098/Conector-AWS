'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app=express();

const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const CHAMARA_TABLE =process.env.CHAMARA_TABLE;
app.use(bodyParser.json({string:false}));

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Si jala compa!',
        input: event,
      },
      null,
      2
    ),
  };
};
