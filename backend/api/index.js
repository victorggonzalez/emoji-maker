// Copy the entire contents of app.js to this file
// Make sure to export the Express app at the end:
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

(async () => {
  const axiosRetry = (await import("axios-retry")).default;
  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
})();
const https = require("https");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Key is missing. Please check your .env file.");
  process.exit(1);
}

if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("Clerk keys are missing. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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

// Simple middleware to check for the presence of a token
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  // For now, we're just checking if a token exists
  // In a production environment, you'd want to verify this token
  next();
};

// Use the simple auth middleware for protected routes
app.use("/api", requireAuth);

const handleAuth = async (req, res, next) => {
  console.log("Handling auth");
  console.log("req.auth:", req.auth);
  try {
    const userId = req.auth.userId;
    console.log("Authenticated user:", userId);

    // Check if user exists in profiles table
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!profile) {
      // User doesn't exist, create a new profile
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([{ user_id: userId, credits: 3, tier: "free" }])
        .select()
        .single();

      if (insertError) throw insertError;
      profile = newProfile;
      console.log("Created new user profile:", profile);
    } else {
      console.log("Existing user profile:", profile);
    }

    req.profile = profile;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const clerk = require("@clerk/clerk-sdk-node");

const clerkMiddleware = clerk.ClerkExpressRequireAuth({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Then use it in your routes
app.use(clerkMiddleware);

// Apply handleAuth only to specific routes
const authRoutes = [
  "/api/generate-emoji",
  "/api/like-emoji",
  "/api/unlike-emoji",
  "/api/initialize-user",
];
app.use(authRoutes, handleAuth);

// Use the simple auth middleware for protected routes
app.use("/api", requireAuth);

// New helper function for uploading emoji to Supabase
async function uploadEmojiToSupabase(imageUrl, prompt, userId) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      httpsAgent: new https.Agent({ keepAlive: true }),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const buffer = Buffer.from(response.data, "binary");
    const fileName = `emoji_${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("emojis")
      .upload(fileName, buffer, {
        contentType: "image/png",
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("emojis")
      .getPublicUrl(fileName);

    const { data: emojiData, error: emojiError } = await supabase
      .from("emojis")
      .insert({
        image_url: publicUrlData.publicUrl,
        prompt: prompt,
        creator_user_id: userId,
      })
      .select()
      .single();

    if (emojiError) throw emojiError;

    return { publicUrl: publicUrlData.publicUrl, emojiData };
  } catch (error) {
    console.error("Error uploading emoji:", error);
    throw error;
  }
}

// Updated /api/generate-emoji route
app.post("/api/generate-emoji", async (req, res) => {
  const inputPrompt = req.body.input.prompt;
  const userId = req.auth.userId;
  const input = {
    prompt: "A TOK emoji of " + inputPrompt,
    width: 1024,
    height: 1024,
    apply_watermark: false,
  };
  try {
    if (req.profile.credits <= 0) {
      return res.status(403).json({ error: "Not enough credits" });
    }

    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      { input }
    );

    const imageUrl = output[0];
    const { publicUrl, emojiData } = await uploadEmojiToSupabase(imageUrl, inputPrompt, userId);

    // Deduct a credit
    const { error } = await supabase
      .from("profiles")
      .update({ credits: req.profile.credits - 1 })
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ output: publicUrl, emojiData });
  } catch (error) {
    console.error("Error processing emoji:", error);
    res.status(500).json({ error: "An error occurred while processing the emoji" });
  }
});

// Updated /api/upload-emoji route
app.post("/api/upload-emoji", async (req, res) => {
  const { imageUrl } = req.body;
  const userId = req.auth.userId;

  try {
    const { publicUrl, emojiData } = await uploadEmojiToSupabase(imageUrl, "Uploaded for testing", userId);
    res.json({ message: "Emoji uploaded successfully", emojiData });
  } catch (error) {
    console.error("Error uploading emoji:", error);
    res.status(500).json({ error: "An error occurred while uploading the emoji" });
  }
});

// Update the /api/like-emoji route
app.post("/api/like-emoji", async (req, res) => {
  const { emojiId } = req.body;
  const userId = req.auth.userId;

  try {
    // Check if the user has already liked this emoji
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('emoji_likes')
      .select()
      .eq('emoji_id', emojiId)
      .eq('user_id', userId)
      .single();

    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      console.error("Error checking existing like:", likeCheckError);
      throw likeCheckError;
    }

    if (existingLike) {
      return res.status(400).json({ error: "You've already liked this emoji" });
    }

    // Add the like to emoji_likes table
    const { data: insertedLike, error: insertError } = await supabase
      .from('emoji_likes')
      .insert({ emoji_id: emojiId, user_id: userId })
      .select();

    if (insertError) {
      console.error("Error inserting like:", insertError);
      throw insertError;
    }

    console.log("Inserted like:", insertedLike);

    // Increment the likes_count using rpc
    const { data: incrementResult, error: incrementError } = await supabase
      .rpc('increment', { row_id: emojiId });

    if (incrementError) {
      console.error("Error incrementing likes count:", incrementError);
      throw incrementError;
    }

    // Fetch the updated emoji
    const { data: updatedEmoji, error: fetchError } = await supabase
      .from('emojis')
      .select()
      .eq('id', emojiId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated emoji:", fetchError);
      throw fetchError;
    }

    console.log("Updated emoji:", updatedEmoji);

    res.json({ likes: updatedEmoji.likes_count });
  } catch (error) {
    console.error("Error liking emoji:", error);
    res.status(500).json({ error: "An error occurred while liking the emoji" });
  }
});

// Update the /api/unlike-emoji route
app.post("/api/unlike-emoji", async (req, res) => {
  const { emojiId } = req.body;
  const userId = req.auth.userId;

  try {
    // Check if the user has liked this emoji
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('emoji_likes')
      .select()
      .eq('emoji_id', emojiId)
      .eq('user_id', userId)
      .single();

    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      console.error("Error checking existing like:", likeCheckError);
      throw likeCheckError;
    }

    if (!existingLike) {
      return res.status(400).json({ error: "You haven't liked this emoji" });
    }

    // Remove the like from emoji_likes table
    const { data: deletedLike, error: deleteError } = await supabase
      .from('emoji_likes')
      .delete()
      .eq('emoji_id', emojiId)
      .eq('user_id', userId)
      .select();

    if (deleteError) {
      console.error("Error deleting like:", deleteError);
      throw deleteError;
    }

    console.log("Deleted like:", deletedLike);

    // Decrement the likes_count using rpc
    const { data: decrementResult, error: decrementError } = await supabase
      .rpc('decrement', { row_id: emojiId });

    if (decrementError) {
      console.error("Error decrementing likes count:", decrementError);
      throw decrementError;
    }

    // Fetch the updated emoji
    const { data: updatedEmoji, error: fetchError } = await supabase
      .from('emojis')
      .select()
      .eq('id', emojiId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated emoji:", fetchError);
      throw fetchError;
    }

    console.log("Updated emoji:", updatedEmoji);

    res.json({ likes: updatedEmoji.likes_count });
  } catch (error) {
    console.error("Error unliking emoji:", error);
    res.status(500).json({ error: "An error occurred while unliking the emoji" });
  }
});

// Update the /api/emojis endpoint
app.get("/api/emojis", async (req, res) => {
  const userId = req.auth.userId;

  try {
    const { data, error } = await supabase
      .from("emojis")
      .select(`
        *,
        emoji_likes (user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to include a boolean 'liked' property
    const transformedData = data.map(emoji => ({
      ...emoji,
      liked: emoji.emoji_likes.some(like => like.user_id === userId),
      emoji_likes: undefined // Remove the emoji_likes array from the response
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching emojis:", error);
    res.status(500).json({ error: "An error occurred while fetching emojis" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

app.post("/api/initialize-user", async (req, res) => {
  try {
    // This route already has handleAuth applied, so req.profile should be available
    const { user_id, credits, tier } = req.profile;
    
    // Only send back the necessary information
    res.json({
      message: "User initialized successfully",
      profile: {
        user_id,
        credits,
        tier
      }
    });
  } catch (error) {
    console.error("Error in initialize-user route:", error);
    res.status(500).json({ error: "An error occurred while initializing the user" });
  }
});

module.exports = app;
