class CONFLICT_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = CONFLICT_ERROR;
