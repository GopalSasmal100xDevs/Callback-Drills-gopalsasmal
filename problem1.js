const fs = require("fs");
const path = require("path");
const directoryFilesPath = path.join(__dirname, "json-files");

/*
    Problem 1:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Create a directory of random JSON files
        2. Delete those files simultaneously 
*/

function createAndDelete(numberOfFiles = 1) {
  createDirectory(directoryFilesPath, () => {
    createJsonFiles(numberOfFiles, directoryFilesPath, (fileName) => {
      deleteJsonFiles(fileName);
    });
  });
}

function createDirectory(directoryFilesPath, cb) {
  fs.mkdir(directoryFilesPath, (err) => {
    if (err) {
      console.log("Error create directory");
    } else {
      console.log("Directory created!");
      cb();
    }
  });
}

function generateRandomJsonValues() {
  return JSON.stringify({
    id: Math.floor(Math.random() * 100000),
    user: `User${Math.floor(Math.random() * 1000)}`,
    value: Math.random() * 10,
  });
}

function createJsonFiles(numberOfFiles, directoryPath, cb) {
  for (let index = 1; index <= numberOfFiles; index++) {
    const fileName = path.join(directoryPath, `file${index}.json`);
    const jsonData = generateRandomJsonValues();
    fs.writeFile(fileName, jsonData, (err) => {
      if (err) {
        console.log("Error, File creation!");
      } else {
        console.log(`file created file${index}.json`);
        cb(fileName);
      }
    });
  }
}

function deleteJsonFiles(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.log("Error, Remove file!");
    } else {
      console.log("File deleted!");
    }
  });
}

module.exports = { createAndDelete };
