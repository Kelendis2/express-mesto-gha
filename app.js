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
    _id: '64a85b2e77b797d7c979bcf9'
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен!');
});
