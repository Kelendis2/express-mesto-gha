const errorHandler = (err, req, res, next) => {
  if (err instanceof celebrate.ValidationError) {
    // Обработка ошибок валидации
    return res.status(400).json({
      message: 'Переданы некорректные данные при создании пользователя.',
    });
  }
  // если нет статуса выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
};
module.exports = errorHandler;
