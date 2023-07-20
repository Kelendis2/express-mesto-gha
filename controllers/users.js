const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ERROR_CODE_UNIQUE } = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const NotUnique = require('../utils/errors/ NotUnique');
const ErrorAccess = require('../utils/errors/ErrorAccess');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const findById = (req, res, next, id) => {
  User.findById(id)
    .orFail(new NotFound(`Пользователь по указанному id: ${id} не найден`))
    .then((user) => res.send(user))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  findById(req, res, next, userId);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  findById(req, res, next, _id);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(String(password), 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === ERROR_CODE_UNIQUE) {
        next(new NotUnique('Пользователь с такой почтой уже зарегистрирован'));
      } else if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
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
      res.send(user);
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
      res.json(user);
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
  User.findOne({ email })
    .select('+password')
    .orFail(new ErrorAccess('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const newToken = jwt.sign({ _id: user._id }, JWT_SECRET);
            res.cookie('token', newToken, {
              maxAge: 36000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            }).send({ data: user.toJSON() });
          } else {
            next(new ErrorAccess({ message: 'Неверный логин или пароль' }));
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
  findById,
  login,
};
