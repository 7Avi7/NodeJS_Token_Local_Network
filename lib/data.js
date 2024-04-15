const fs = require("fs");

const path = require("path");

const lib = {};

// Base directory of the data folder

lib.basedir = path.join(__dirname, "/../.data/");

// write data to file

lib.create = (dir, file, data, callback) => {
  // open file for writing

  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      // Write data to file and then close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Error closing the new file!");
            }
          });
        } else {
          callback("Error writing to new file!");
        }
      });
    } else {
      callback("Could not create new file, it may already exist!");
    }
  });
};

// Read data from file

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// Update existing file

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert that data to a string
      const stringData = JSON.stringify(data);

      // truncate the file

      fs.ftruncate(fileDescriptor, (err1) => {
        if (!err1) {
          fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
              // close the file
              fs.close(fileDescriptor, (err3) => {
                if (!err3) {
                  callback(false);
                } else {
                  callback("Error Closing File!");
                }
              });
            } else {
              callback("Error Writing to file!");
            }
          });
        } else {
          callback("Error Truncating file!");
        }
      });
    } else {
      console.log(`Error updating .File may not exist`);
    }
  });
};

// Delete Existing File

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Error deleting file`);
    }
  });
};

module.exports = lib;
