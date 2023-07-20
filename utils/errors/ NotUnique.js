class NotUnique extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 100;
  }
}

module.exports = NotUnique;
