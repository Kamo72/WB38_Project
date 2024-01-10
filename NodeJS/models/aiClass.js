//aiClass.js

require("dotenv").config({ path: "C:/Project/WB38_Project/NodeJS/.env" });
const mysql = require("mysql");
const fs = require("fs").promises;
const util = require("util");

const tritonModule = require("./tritonClass.js");
const rasaModule = require("./rasaClass.js");

class AI {
  constructor() {
    this.db = mysql.createConnection({
      host: "localhost",
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    this.db.connect();
    this.queryAsync = util.promisify(this.db.query).bind(this.db);
  }

  getUserHistory(username, callback) {
    this.db.query(
      "SELECT * FROM userHistory where username = ?",
      [username],
      (error, results) => {
        if (error) return callback(error);

        const encodedImages = results.map((result) => {
          return result.image.toString("base64");
        });
        return callback(null, encodedImages, results);
      }
    );
  }

  createUserHistory(
    username,
    images,
    petname,
    petbreed,
    api,
    usertext,
    callback
  ) {
    const queryAsync = this.queryAsync;

    // async
    const insertImages = async () => {
      for (const image of images) {
        try {
          const imageData = await fs.readFile(image.path);
          var queryResult = [];

          tritonModule.TritonRequest(
            imageData,
            petbreed,
            api,
            async function (error, responses) {
              if (error) return callback(error);

              await tritonModule.postprocessResponses(
                responses,
                async function (error, parseResult) {
                  if (error) return callback(error);

                  // db insert
                  for (const result of parseResult) {
                    const queryTemp = await insertuserHistory(
                      username,
                      imageData,
                      petname,
                      petbreed,
                      usertext,
                      result,
                      queryAsync
                    );

                    queryResult.push(queryTemp);
                  }
                  if (!queryResult) return callback("db insert error");

                  // rasa 호출
                  await rasaModule.rasaRequest(
                    parseResult,
                    (error, rasaResult) => {
                      if (error) return callback(error);

                      const obj = Objectify(rasaResult);
                      return callback(null, obj);
                    }
                  );
                }
              );
            }.bind(this)
          );
        } catch (error) {
          return callback(error);
        }
      }
    };

    insertImages();
  }
}

// userHistory insert function
async function insertuserHistory(
  username,
  imageData,
  petname,
  petbreed,
  usertext,
  diseaseid,
  queryAsync
) {
  let queryResult;

  if (diseaseid == null) {
    queryResult = await queryAsync(
      "INSERT INTO userHistory (username, image, petname, petbreed, usertext) VALUES(?,?,?,?,?)",
      [username, imageData, petname, petbreed, usertext]
    );
  } else {
    queryResult = await queryAsync(
      "INSERT INTO userHistory (username, image, petname, petbreed, usertext, diseaseid) VALUES(?,?,?,?,?,?)",
      [username, imageData, petname, petbreed, usertext, diseaseid]
    );
  }

  return queryResult;
}

async function Objectify(rasaResult) {
  console.log(rasaResult);

  return (obj = {
    aftercare: rasaResult.aftercare,
    cure: rasaResult.cure,
    diseaseName: rasaResult.diseaseName,
    reason: rasaResult.reason,
  });
}

module.exports = new AI();