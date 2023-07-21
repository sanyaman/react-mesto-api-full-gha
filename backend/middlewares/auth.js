const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../errors/401');

const { SECRET_KEY, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'develop' ? SECRET_KEY : 'PUTIN');
  } catch (err) {
    throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
  }
  req.user = payload._id;
  next();
};
