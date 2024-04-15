// dependencies

const data = require("../../lib/data");

const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  //   console.log(requestProperties);

  const acceptMethods = ["get", "post", "put", "delete"];

  if (acceptMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

// POST
handler._user.post = (requestProperties, callback) => {
  const { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;

  if (
    typeof firstName === "string" &&
    firstName.trim().length > 0 &&
    typeof lastName === "string" &&
    lastName.trim().length > 0 &&
    typeof phone === "string" &&
    phone.trim().length === 11 &&
    typeof password === "string" &&
    password.trim().length > 0 &&
    typeof tosAgreement === "boolean" &&
    tosAgreement
  ) {
    data.read("users", phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: "User created successfully" });
          } else {
            callback(500, { error: "Could not create a user" });
          }
        });
      } else {
        callback(400, { error: "User already exists" });
      }
    });
  } else {
    callback(400, {
      error: "Invalid request. Please provide all required fields.",
    });
  }
};

// GET
handler._user.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // Verify Token

    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // Look up the user
        data.read("users", phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "Requested user was not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};

// UPDATE

handler._user.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // Verify Token

      let token =
        typeof requestProperties.headersObject.token === "string"
          ? requestProperties.headersObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // Lookup the user
          data.read("users", phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              // Store to database

              data.update("users", phone, userData, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "User was updated successfully!",
                  });
                } else {
                  callback(500, {
                    error: "There was a problem in the server side",
                  });
                }
              });
            } else {
              callback(400, { error: "You have a problem in your request1" });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failure!",
          });
        }
      });
    } else {
      callback(400, { error: "You have a problem in your request" });
    }
  } else {
    callback(400, { error: "Invalid Phone Number. Please try again" });
  }
};

// DELETE
handler._user.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // Verify Token

    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user

        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            data.delete("users", phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: "User was successfully deleted!",
                });
              } else {
                callback(500, {
                  error: "There was a server side error",
                });
              }
            });
          } else {
            callback(500, {
              error: "There was a server side error",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(500, {
      error: "There was problem in your request!",
    });
  }
};

module.exports = handler;
