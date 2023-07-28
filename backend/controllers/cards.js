const card = require('../models/card');
// eslint-disable-next-line import/order, no-unused-vars
// const { ObjectId } = require('mongoose').Types;
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
    // eslint-disable-next-line no-shadow
    .then((card) => {
      res.send(card);
    })
    .then((populateCard) => populateCard.populate('owner'))
    .then((newCard) => {
      if (!newCard) {
        throw new BAD_REQUEST('Переданы некорректные данные при добавлении карточки');
      }
      res.send(newCard);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .then((dbCard) => {
      if (!dbCard) {
        throw new NOT_FOUND_ERROR('Карта с данным _id не найдена');
      }
      if (dbCard.owner.toString() !== req.user) {
        throw new FORBIDDEN(
          'Невозможно удалить карту с другим _id пользователя',
        );
      }
      return card
        .deleteOne({ _id: dbCard._id })
        // eslint-disable-next-line consistent-return
        .then((c) => {
          if (c.deletedCount === 1) {
            return dbCard;
          }
        })
        .then((removedCard) => res.send({ data: removedCard }));
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user } }, { new: true })
    .populate('likes owner')
    .then((likedCard) => {
      if (likedCard) {
        res.send(likedCard);
      } else if (!likedCard) {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};

module.exports.removeLike = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user } }, { new: true })
    .populate('likes owner')
    .then((dislikedCard) => {
      if (dislikedCard) {
        res.send(dislikedCard);
      } else {
        throw new NOT_FOUND_ERROR(
          `Карта с указанным _id => ${req.params.cardId} <= не найдена`,
        );
      }
    })
    .catch(next);
};
