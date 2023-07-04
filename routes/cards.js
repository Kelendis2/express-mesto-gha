const router = require("express").Router();

const { createCard, getCards, deleteCard, likeCard,dislikeCard } = require("../controllers/cards");

router.post("/", createCard);
router.get("/", getCards);
router.delete("/:id", deleteCard);
router.patch("cards/:cardId/likes", likeCard)
router.patch("cards/:cardId/likes", dislikeCard)

module.exports = router;
