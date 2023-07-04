const User = require('../models/user');

const ERROR_CODE = 400;
const BAD_REQUEST_CODE = 400;
const INTERNAL_CODE = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE)
          .send({ massage: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate( req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE)
          .send({ massage: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

  User.findByIdAndUpdate( req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
