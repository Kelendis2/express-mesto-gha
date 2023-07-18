const errorHandler = (err, req, res, next) => {
  res.status(500).send({ message: 'Произошла ошибка'});
  next();
};

module.exports = errorHandler;
