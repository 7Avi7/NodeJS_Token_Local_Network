const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "You requested url was not found",
  });
};

module.exports = handler;
