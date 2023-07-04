const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

mongoose.connect("mongodb://localhost:27017/mestodb ");

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a06da92a2532d14c1380cb'
  };

  next();
});

app.use("/users", usersRouter);

app.use("/cards", cardsRouter);



app.listen(3000, () => {
  console.log("Сервер запущен!");
});
