const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a85bbe77b797d7c979bcfd'
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
