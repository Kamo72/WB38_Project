// chat.js

require("dotenv").config({ path: "S:/Project/24 해커톤 부활의식/ProjectFiles/WB38_Project/.env" });

var express = require("express");
var router = express.Router();
const rasaModule = require("../models//rasaClass.js");

const { OpenAI } = require("openai");

const callGpt35 = async (prompt) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("gpt35 error :", error);
  }
};

router.post("", async function (req, res) {

  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request query:", JSON.stringify(req.query, null, 2));
  console.log("Request params:", JSON.stringify(req.params, null, 2));
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));

  console.log("chat request - req : " + req.body.text);
  if (!req.body) console.log("req.body not exists!")
  if (!req.body) res.status(401).json({ error: "잘못된 접근" });

  if (req.body.text) {
    const data = {
      text: req.body.text,
    };

    await rasaModule.rasaRequest(data, async (error, rasaResult) => {
      console.log("rasaRequest init")
      // if (!error) 
      // {
        console.log("rasaRequest error : " + error)

        const response = await callGpt35(req.body.text);
        if (response) {
          console.log("GPT succeed : " + response)
          return res.status(200).json({ answer: response });
        } else {
          console.log("GPT failed : " + response)
          return res.status(401).json({ error: "gpt error" });
        }
      // }

      console.log("rasaRequest succeed : " + rasaResult)
      return res.status(200).json({ answer: rasaResult });
    });
  } else {
    const data = {
      diseaseid: req.body.diseaseid,
      possibility: req.body.possibility,
      improvement: req.body.improvement,
    };

    await rasaModule.rasaRequest(data, async (error, rasaResult) => {
      if (error) return res.status(401).json({ error: error });

      const parsedText = rasaResult.split("\n");
      return res.status(200).json({ answer: parsedText });
    });
  }
});

module.exports = router;
