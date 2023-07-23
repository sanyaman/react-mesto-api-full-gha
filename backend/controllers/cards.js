const card = require('../models/card');
// eslint-disable-next-line import/order, no-unused-vars
const { ObjectId } = require('mongoose').Types;
const NOT_FOUND_ERROR = require('../errors/404');
const FORBIDDEN = require('../errors/403');
const BAD_REQUEST = require('../errors/400');

module.exports.createCard = async (req, res, next) => {
  const {
    name, link, owner = req.user, likes = [], createAt,
  } = req.body;
  await card
    .create({
      name,
      link,
      owner,
      likes,
      createAt,
    })
    .then((populateCard) => populateCard.populate('owner'))
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BAD_REQUEST('Переданы некорректные данные при добавлении карточки'),
        );
      }
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .populate('owner')
    .then((cards) => {
      res.send({ cards });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.cardId)
    .then((cardDelete) => {
      if (!cardDelete) {
        throw new NOT_FOUND_ERROR('Карта с данным _id не найдена');
      }
      if (cardDelete.owner.toString() !== req.user) {
        throw new FORBIDDEN(
          'Невозможно удалить карту с другим _id пользователя',
        );
      }
      return card
        .deleteOne({ _id: cardDelete._id })
        // eslint-disable-next-line consistent-return
        .then((c) => {
          if (c.deletedCount === 1) {
            return cardDelete;
          }
        })
        .then((removedCard) => res.send({ data: removedCard }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user } }, { new: true })
    .populate('likes owner')
    .then((addLike) => {
      if (addLike) {
        res.send({ addLike });
      } else if (!addLike) {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user } }, { new: true })
    .populate('likes owner')
    .then((removeLike) => {
      if (removeLike) {
        res.send({ removeLike });
      } else {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};
