const router = require('express').Router();
const { validateCard, validateCardID } = require('../utils/validate');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', validateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validateCardID, deleteCard);
router.put('/:cardId/likes', validateCardID, likeCard);
router.delete('/:cardId/likes', validateCardID, dislikeCard);

module.exports = router;
