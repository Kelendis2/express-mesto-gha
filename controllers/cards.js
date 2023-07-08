const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');


const ERROR_CODE = 404;
const BAD_REQUEST_CODE = 400;
const INTERNAL_CODE = 500;

const createCard = (req, res) => {
  const {name, link, owner, likes, createdAt} = req.body;
  Card.create({ name, link, owner, likes, createdAt })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card._id) {
        res
          .status(ERROR_CODE)
          .send({ massage: 'Запрашиваемая карточка не найдена' });
      }
      res.send(card);
    })
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные преданны некоректно' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные переданны некоректно' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports = { createCard, getCards, deleteCard, likeCard, dislikeCard };
