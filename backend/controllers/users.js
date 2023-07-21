const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NOT_FOUND_ERROR = require('../errors/404');
const UNAUTHORIZED = require('../errors/401');
const CONFLICT_ERROR = require('../errors/409');
const BAD_REQUEST = require('../errors/400');

const { SECRET_KEY, NODE_ENV } = process.env;

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BAD_REQUEST(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } if (err.code === 11000) {
        return next(
          new CONFLICT_ERROR(`Пользователь с почтой'${email}' уже существует.`),
        );
      } return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user;
  user
    .findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user
    .findById(req.params.userId)
    .then((users) => {
      if (users) {
        res.send({ data: users });
      } else {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((users) => {
      if (!users) {
        throw new NOT_FOUND_ERROR(
          'Не удалось обновить информацию пользователя по указанному id',
        );
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BAD_REQUEST('Переданы некорректные данные при обновлении профиля'),
        );
      }
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Переданные некорректные данные id'));
      }
      return next(err);
    });
};

module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.user,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Не удалось обновить данные аватара');
      }
      res.send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BAD_REQUEST('Переданы некорректные данные при обновлении аватара'),
        );
      }
      if (err.name === 'CastError') {
        return next(new BAD_REQUEST('Переданные не корректные данные id.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email })
    .select('+password')
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
      }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new UNAUTHORIZED('Неправильно указан логин и/или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'develop' ? SECRET_KEY : 'PUTIN', {
            expiresIn: '7d',
          });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          });
          res.send({
            data: `${user.email} Вход выполнен , начинается телепортация в мета вселенную`,
          });
        });
    })
    .catch(next);
};
