class SERVER_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = SERVER_ERROR;
