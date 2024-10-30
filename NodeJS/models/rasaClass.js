//rasaClass.js

require("dotenv").config({ path: "S:/Project/24 해커톤 부활의식/ProjectFiles/WB38_Project/.env" });

const axios = require("axios");

const rasa = axios.create({
  baseURL: "http://localhost:5005",
  timeout: 5000,
});

class Rasa {
  async rasaRequest(text, callback) {
    try {
      let data;
      if (text.text) {
        console.log("text recieved!")
        data = text.text;
      } else {

        // if(text.diseaseid == undefined || text.improvement == undefined || text.possibility == undefined)
          throw new Error("이렇게 막 들어오시면 안돼요.");

        console.log("text not recieved!")
        data = `${text.diseaseid}, ${text.improvement}, ${text.possibility}`;
      }

      await requestRasa(data).then((responses) => {
        return callback(null, responses[0].text);
      });
    } catch (error) {
      console.log("rasaRequest error!")
      console.log("i need to activate callback@!!@!!!!!" + callback + " - error : " + error)
      return callback(error);
    }
  }
}

async function requestRasa(text, sender = "default") {
  try {
    const response = await rasa.post("/webhooks/rest/webhook", {
      message: text,
      sender: sender,
    });

    return response.data;
  } catch (error) {
    console.log("requestRasa error!")
    console.error(error);
  }
}

module.exports = new Rasa();
