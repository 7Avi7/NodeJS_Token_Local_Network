// Dependencies
const { log } = require("console");
const http = require("http");

const { handleReqRes } = require("./helpers/handleReqRes");

const environment = require("./helpers/environments");

const data = require("./lib/data");

// App object module scaffolding

const app = {};

// Testing File System

// data.create(
//   "test",
//   "newFile",
//   { name: "Bangladesh", language: "Bangla" },
//   (err) => {
//     console.log(`Error was : `, err);
//   }
// );

// data.read(
//   "test",
//   "newFile",

//   (err, data) => {
//     console.log(err, data);
//   }
// );

// data.update(
//   "test",
//   "newFile",
//   { name: "England", language: "English" },

//   (err) => {
//     console.log(err);
//   }
// );

data.delete(
  "test",
  "newFile",

  (err) => {
    console.log(err);
  }
);

//  Configuration

// app.config = {
//   port: 3000,
// };

// Create Server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    // console.log(`environment variable is ${process.env.NODE_ENV}`);
    console.log(`Listening to port ${environment.port}`);
  });
};

//  Handle Request Response

app.handleReqRes = handleReqRes;

// Start The Server

app.createServer();
