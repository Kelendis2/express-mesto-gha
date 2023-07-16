const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const {
  BAD_REQUEST_CODE, ERROR_NOT_FOUND, INTERNAL_CODE, STATUS_OK,
} = require('../utils/constants');

const User = require('../models/user');

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Запрашиваемые пользователи не найдены' });
      }
      res.send(users);
    })
    .catch(() => {
      res
        .status(INTERNAL_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ massage: 'Запрашиваемый пользователь не найден' });
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные введены некоректно' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

// new
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      // eslint-disable-next-line no-console
      console.log(user);
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные введены некоректно' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              // eslint-disable-next-line no-underscore-dangle
              _id: user._id,
            }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: 36000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            res.status(403)
              .send({ message: 'Неверный логин или пароль' });
          }
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfileInfo,
  login,
};
