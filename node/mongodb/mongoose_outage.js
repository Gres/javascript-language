const mongoose = require('mongoose');

const options = {
  server: {
    socketOptions: {
      connectTimeoutMS: 30000,
      keepAlive: 1
    }
  },
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10 // Maintain up to 10 socket connections
};

let mongodb = null;

mongoose.connect('mongodb://localhost:27017/video-query', options)
  .then((connection) => {
    mongodb = connection.connection.db;
    console.log('mongodb connection success');
  })
  .catch((err) => {
    console.log('mongodb connection failed');
  });


const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(express.static('static'));

const CAPTION_READY_IN = 60 * 1000;

const captionReady = {};

app.get('/1', function (req, res) {
  console.log('/ end point reached');
  mongodb
    .collection('videos')
    .find({})
    .limit(10)
    .toArray()
    .then((data) => {
      console.log('data sent ');
      res.send(data);
    })
    .catch((err) => {
      console.log('error caught ');
      res.send(err);
    });
});

app.get('/2', function (req, res) {
  console.log('/ end point reached');
  mongodb
    .collection('videos')
    .find({})
    .limit(10)
    .toArray()
    .then((data) => {
      console.log('data sent ');
      res.send(data);
    })
    .catch((err) => {
      console.log('error caught ');
      res.send(err);
    });
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));
