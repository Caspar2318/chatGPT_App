import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config(); //to use dotenv variables

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}); //config API

const openai = new OpenAIApi(configuration); //create instance of open  AI

const app = express(); //initialize express application

app.use(cors()); //set middlewares

app.use(express.json()); //pass json from front end to back end

// set routes
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Welcome to CodeX",
  });
});

// set post to carry payload, see example inside OpenAI for
//'Natural language to OpenAI API' - use model as 'text-davinci-003' - view code to see parameters
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
