const User = require("../models/users");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { createUser, getUsers, getUser };
