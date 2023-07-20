const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const { validateUserAuth, validateUserCreate } = require('./utils/validate');
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

app.post('/signup', validateUserCreate, createUser);
app.post('/signin', validateUserAuth, login);

app.use(auth);

app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use(errors());
app.use(errorHandler);

/* app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
}); */

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен!');
});

// проверка
// eslint-disable-next-line no-console
console.log('Проверка!');
