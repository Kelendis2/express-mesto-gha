const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  const { jwt: { token } = {} } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен аутентификации' });
  }
};

module.exports = auth;
