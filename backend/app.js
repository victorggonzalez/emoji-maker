const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post("/api/generate-emoji", async (req, res) => {
  const input = req.body.input;
  console.log(input);
  try {
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input,
      }
    );
    console.log(output);
    res.json({ output });
  } catch (error) {
    console.error("Error calling Replicate API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the emoji" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
