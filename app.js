const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен!');
});
