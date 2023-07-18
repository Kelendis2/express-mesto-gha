const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { STATUS_OK, JWT_SECRET } = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const { validateUser, validateUserID, validateUserAvatar } = require('../utils/validate');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next, id) => {
  User.findById(id)
    .orFail(new NotFound(`Пользователь по указанному id: ${id} не найден`))
    .then((user) => res.send(user))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(req, res, next, _id);
};

const createUser = (req, res, next) => {
  const { error } = validateUser.validate(req.body);
  if (error) {
    next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
  }
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
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateProfileInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь по указанному id не найден'));
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequest('Данные введены некоректно'));
      } else {
        next(err);
      }
    });
};

// new
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.status(STATUS_OK).json(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).send({ message: 'Введите данные' });
  }
  User.findOne({ email })
    .select('+password')
    .orFail(new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const { token } = req.cookies;
            if (token) {
              const { _id } = jwt.verify(token, JWT_SECRET);
              const newToken = jwt.sign({ _id }, JWT_SECRET);
              res.cookie('token', newToken, {
                maxAge: 36000,
                httpOnly: true,
                sameSite: true,
              }).send({ data: user.toJSON() });
            } else {
              res.status(403)
                .send({ message: 'Требуется аутентификация' });
            }
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
  getCurrentUser,
  login,
};
