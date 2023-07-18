const { ValidationError } = require('mongoose').Error;
const { STATUS_OK, INVAILD_ID } = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');

const Card = require('../models/card');

const createCard = (req, res, next) => {
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
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res
        .status(STATUS_OK)
        .send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error(INVAILD_ID))
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err.message === INVAILD_ID) {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Данные переданны некоректно'));
      } else {
        next(err);
      }
    });
};
const likeCard = (req, res, next) => {
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
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Данные переданны некоректно'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Данные переданны некоректно'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
