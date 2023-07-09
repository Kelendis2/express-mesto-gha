const { ValidationError, CastError } = require('mongoose').Error;

const { BAD_REQUEST_CODE, ERROR_NOT_FOUND, INTERNAL_CODE} = require('../utils/constants');

const User = require('../models/user');

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      else { res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};



const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate( req.params.userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ massage: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные введены некоректно' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

// new
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate( req.params.userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные введены некоректно' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfileInfo,
};
