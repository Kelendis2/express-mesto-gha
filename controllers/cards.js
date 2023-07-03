/*const Card = require("../models/cards");

const createCard = (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;
  Card.create({ name, link, owner, likes, createdAt })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { createCard };*/
