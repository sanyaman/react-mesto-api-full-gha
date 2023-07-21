module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Сервер не отвечает , повторите запрос позднее' : message,
  });
  next();
};
