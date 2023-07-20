const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const ErrorAccess = require('../utils/errors/ErrorAccess');

const handleAuthError = (req, res, next) => next(new ErrorAccess('Необходима авторизация'));
// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return handleAuthError(req, res, next);
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return handleAuthError(req, res, next);
  }
};

module.exports = auth;
