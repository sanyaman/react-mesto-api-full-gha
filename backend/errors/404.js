class NOT_FOUND_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NOT_FOUND_ERROR;
