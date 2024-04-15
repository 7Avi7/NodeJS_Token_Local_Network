// Dependencies

const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/RouteHandlers/notFoundHandler");

const { parseJSON } = require("../helpers/utilities");

// Module Scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // Request Handling
  // Get The URL And Parse It

  const parsedURL = url.parse(req.url, true);

  console.log(parsedURL);
  const path = parsedURL.pathname;
  // http://localhost:3000/about?a=5&b=6
  console.log(path);

  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  // http://localhost:3000/about/index
  console.log(trimmedPath);

  const method = req.method.toLowerCase();

  const queryStringObject = parsedURL.query;

  console.log(queryStringObject);

  const headersObject = req.headers;
  console.log(headersObject);

  const requestProperties = {
    parsedURL,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  // Checking Routes are exists or not

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    // console.log(realData);

    requestProperties.body = parseJSON(realData);

    chosenHandler(requestProperties, (statusCode, payLoad) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payLoad = typeof payLoad === "object" ? payLoad : {};

      const payLoadString = JSON.stringify(payLoad);

      //  return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payLoadString);
    });

    // Response HAndle
    // res.end("Hello world");
  });
};

module.exports = handler;
