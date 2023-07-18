const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const {
  createUser,
  login,
} = require('./controllers/users');

const app = express();
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');


mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(errorHandler);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен!');
});
