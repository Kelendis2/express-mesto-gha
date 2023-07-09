const { ValidationError, CastError } = require('mongoose').Error;
const { BAD_REQUEST_CODE, ERROR_NOT_FOUND, INTERNAL_CODE, STATUS_OK, INVAILD_ID } = require('../utils/constants');
const Card = require('../models/card');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        // eslint-disable-next-line no-console
        console.log(err);
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res
        .status(STATUS_OK)
        .send(cards);
    })
    .catch(() => {
      res
        .status(INTERNAL_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!cardId) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch(() => {
      res
        .status(INTERNAL_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error(INVAILD_ID))
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err.message === INVAILD_ID) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные преданны некоректно' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
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
    .orFail(new Error(INVAILD_ID))
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err.message === INVAILD_ID) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Данные переданны некоректно' });
      } else {
        res
          .status(INTERNAL_CODE)
          .send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
