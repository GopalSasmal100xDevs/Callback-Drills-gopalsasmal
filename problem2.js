const fs = require("fs");
const path = require("path");

/*
    Problem 2:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Read the given file lipsum.txt
        2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
        3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
        4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
        5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
*/

const lipsumFilePath = path.join(__dirname, "lipsum.txt");
const uppercaseLipsumPath = path.join(__dirname, "uppercaseLipsum.txt");
const lowercaseLipsumPath = path.join(__dirname, "lowercaseLipsum.txt");
const sortedLipsumPath = path.join(__dirname, "sortedLipsum.txt");
const filenamesPath = path.join(__dirname, "filenames.txt");

function problem2() {
  readFile(lipsumFilePath, (data) => {
    contentToUppercase(data, uppercaseLipsumPath, (newFilePath) => {
      storeFileName(filenamesPath, newFilePath, () => {
        contentToLowerCase(uppercaseLipsumPath, () => {
          sortContent(lowercaseLipsumPath, () => {
            deleteFiles();
          });
        });
      });
    });
  });
}

// 1. Read the given file lipsum.txt

function readFile(path, cb) {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.log("Error occures to read the file!");
    }

    cb(data);
  });
}

// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
function contentToUppercase(data = "", path, cb) {
  const uppercaseData = data.toUpperCase();
  writeFile(path, uppercaseData, (err) => {
    if (err) {
      console.log("Error when creating new file");
    }
    console.log("Uppercase Data saved!");
    cb(path);
  });
}

// Store file name
function storeFileName(path, newPath, cb) {
  // before store new file path, check if any other path is present?
  let allPaths = [];

  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.log("Error read data!");
    }

    if (!data) {
      allPaths = [newPath];
    } else {
      allPaths = data.split("\n");
      allPaths = [...allPaths, newPath];
    }

    // at the end store the new file path

    writeFile(path, allPaths.join("\n"), (err) => {
      if (err) {
        console.log("Error Store file name!");
      }
      console.log("Store new file name!");
      cb();
    });
  });
}

// 3. Read the new file and convert it to lower case.
//       Then split the contents into sentences.
//       Then write it to a new file. Store the name of the new file in filenames.txt

function writeFile(newFilePath, data, cb) {
  fs.writeFile(newFilePath, data, cb);
}

function contentToLowerCase(uppercaseLipsum, cb) {
  // read the uppercase file;
  readFile(uppercaseLipsum, (data = "") => {
    const lowercaseData = data.toLowerCase();
    const splitedSentences = lowercaseData.split(/(?<=[.!?])\s+/);
    writeFile(lowercaseLipsumPath, splitedSentences.join("\n"), (err) => {
      if (err) {
        console.log("Error to store data in file!");
      }
      console.log("Data saved!");
      storeFileName(filenamesPath, lowercaseLipsumPath, cb);
    });
  });
}

// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt

function sortContent(lowercaseLipsumPath, cb) {
  readFile(lowercaseLipsumPath, (data = "") => {
    const sortedData = data.split(" ").sort((a, b) => a.localeCompare(b));
    writeFile(sortedLipsumPath, sortedData.join("\n"), (err) => {
      if (err) {
        console.log("Error to store data in file!");
      }
      console.log("Sorted Data saved!");
      storeFileName(filenamesPath, sortedLipsumPath, cb);
    });
  });
}

// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
function deleteFiles() {
  readFile(filenamesPath, (data = "") => {
    const allFileNames = data.split("\n");
    allFileNames.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting file");
        }
        console.log("File deleted!");
      });
    });
  });
}

module.exports = { problem2 };
