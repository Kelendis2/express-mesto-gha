const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return res.status(401).json({ message: 'Требуется аутенфикация' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен аутентификации' });
  }
};

module.exports = auth;
