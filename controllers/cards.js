const { ValidationError, CastError } = require('mongoose').Error;
const { BAD_REQUEST_CODE, ERROR_NOT_FOUND, INTERNAL_CODE } = require('../utils/constants');
const Card = require('../models/card');

const createCard = (req, res) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;
  Card.create(
    {
      name, link, owner, likes, createdAt,
    },
  )
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
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные переданны некоректно' });
      } else {
        res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!cardId) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ massage: 'Запрашиваемая карточка не найдена' });
      }
      res.send(card);
    })
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
const likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
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
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
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

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
