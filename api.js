'use strict';
const serverless = require('serverless-http');
const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE;
app.use(bodyParser.json({string:false}));

app.get('/', (req, res) => {
  res.send("Hola mundo con Express");
});

//Crear usuario
app.post('/users', (req, res) => {
    const {userId, name} = req.body;
    
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId, name
      }
    };
    
    dynamoDB.put(params, (error) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            error: 'No se ha podido crear el usuario'
          })
        } else {
          res.json({userId, name});
        }
    });
});

//Obtener usuarios
app.get('/users', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
  };
  
  dynamoDB.scan(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido acceder a los usuarios'
      })
    } else {
      const {Items} = result;
      res.json({
        success: true,
        message: 'Usuarios cargados correctamente',
        users: Items
      });
    }
  })
});


//Obtener un usuario
app.get('/user/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    }
  };
  
  dynamoDB.get(params, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: 'No se ha podido acceder al usuario'
      })
    }
    if (result.Item) {
      const {userId, name} = result.Item;
      return res.json({userId, name});
    } else {
      res.status(404).json({error: 'Usuario no encontrado'})
    }
  })
});

//Actualizar un usuario
app.put('/user/:userId', (req, res) => {
	
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    },
    UpdateExpression: "SET #n = :nombre",
    ExpressionAttributeValues: { 
        ":nombree": req.body.name
    },
    ExpressionAttributeNames:{
    	"#n": "name"
  	}
  };
  
  dynamoDB.update(params, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: 'No se ha podido Actualizar al usuario'
      })
    }
    else
    {
      res.status(200).json({message: 'Usuario actualizado'})
    }
  })
});

//Eliminar un usuario
app.delete('/user/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    }
  };
  
  dynamoDB.delete(params, (error, result) => {
    if (error)
    {
      console.log(error);
      return res.status(400).json({
        error: 'No se ha podido eliminar al usuario'
      })
    }
    else
    {
      res.status(200).json({message: 'Usuario eliminado'})
    }
  })
});

module.exports.todo = serverless(app);
