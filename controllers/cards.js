const { ValidationError } = require('mongoose').Error;
const { STATUS_OK, INVAILD_ID } = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const Forbidden = require('../utils/errors/Forbidden');

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
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail(new NotFound('Карточка с указанным id не найдена'))
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new Forbidden('У пользователя нет возможности удалять карточки других пользователей'));
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound({ message: 'Карточка с указанным id не найдена' }))
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
    .orFail(new NotFound({ message: 'Карточка с указанным id не найдена' }))
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
