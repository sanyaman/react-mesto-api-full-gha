const express = require('express');
const mongoose = require('mongoose');
const requestLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const { MESTODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const NOT_FOUND_ERROR = require('./errors/404');
const errorServer = require('./middlewares/errorServer');

const app = express();
app.use(express.json());
mongoose.connect(MESTODB, {
  family: 4,
});

const limiter = requestLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    'Превышено количество запросов на сервер, попробуйте выполнить запрос позднее',
});

app.use(cookieParser());
app.use(limiter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30)
        .email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
      email: Joi.string().required().min(2).max(30)
        .email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', () => {
  throw new NOT_FOUND_ERROR('Запрашиваемый пользователь не найден');
});

app.use(errors());
app.use(errorServer);
// если всё ок , то бозон Хиггса получен
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Запуск адронного коллайдера : ${PORT}`);
});
