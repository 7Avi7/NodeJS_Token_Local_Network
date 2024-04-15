// Dependencies

const { sampleHandler } = require("./handlers/RouteHandlers/sampleHandler");
const { userHandler } = require("./handlers/RouteHandlers/userHandler");
const { tokenHandler } = require("./handlers/RouteHandlers/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
