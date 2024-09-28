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

const emojiLikes = {};

app.post("/api/generate-emoji", async (req, res) => {
  const inputPrompt = req.body.input.prompt;
  const input = {
    prompt: "A TOK emoji of " + inputPrompt,
    width: 1024,
    height: 1024,
    apply_watermark: false,
  };
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

app.post("/api/like-emoji", (req, res) => {
  const { emojiUrl } = req.body;
  emojiLikes[emojiUrl] = (emojiLikes[emojiUrl] || 0) + 1;
  res.json({ likes: emojiLikes[emojiUrl] });
});

app.post("/api/unlike-emoji", (req, res) => {
  const { emojiUrl } = req.body;
  if (emojiLikes[emojiUrl] && emojiLikes[emojiUrl] > 0) {
    emojiLikes[emojiUrl]--;
  }
  res.json({ likes: emojiLikes[emojiUrl] || 0 });
});

app.get("/api/emoji-likes", (req, res) => {
  res.json(emojiLikes);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
