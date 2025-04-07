# Emoji Maker Backend

This is the backend for the Emoji Maker web application. It's built using **Node.js**, **Express.js**, **Supabase**, and **Clerk** for authentication.

---

## 🧩 Project Overview

The Emoji Maker backend handles:

- User authentication (via Clerk)
- AI-powered emoji generation (via Replicate)
- Storage of emoji assets (via Supabase)
- User interactions (likes, unlikes)
- User credit system (stored in Supabase)

---

## 🧰 Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – API server
- **Supabase** – Database + storage + functions
- **Clerk** – User authentication
- **Replicate** – AI emoji generation (based on prompts)

---

## 🚀 Key Features

1. **User Authentication**  
   Clerk-powered auth, syncing user info into Supabase `profiles`.

2. **Emoji Generation**  
   Uses Replicate to generate unique emojis from user prompts.

3. **Emoji Storage**  
   Saves generated emoji images in a public Supabase bucket (`emojis`).

4. **Emoji Interaction**  
   Like/unlike emojis, with real-time `likes_count` updates using Supabase RPC.

5. **User Credits**  
   Tracks and deducts credits from users for each emoji generation.

---

## 🧾 API Endpoints

- `POST /api/generate-emoji` – Generate a new emoji
- `POST /api/upload-emoji` – Upload a pre-generated emoji
- `POST /api/like-emoji` – Like an emoji
- `POST /api/unlike-emoji` – Unlike an emoji
- `GET /api/emojis` – Fetch all emojis
- `POST /api/initialize-user` – Create user profile in Supabase
- `DELETE /api/delete-emoji/:emojiId` – Delete emoji (owner only)

---

## 🗄️ Supabase Project Setup

All SQL schema changes are organized in `supabase/migrations/`.

### 🧱 Database Tables

- `profiles`: Stores user metadata (user ID, credits, tier, etc.)
- `emojis`: Stores emoji image metadata
- `emoji_likes`: Tracks likes per emoji and user

### 🔗 Relationships

- `emoji_likes.emoji_id` → `emojis.id` (foreign key)

### 📦 Storage

- Public bucket: `emojis`
  - Must be manually created in the Supabase dashboard
  - Used for storing emoji images

### 🧠 Supabase Functions (RPC)

- `increment(row_id bigint)`  
  Increments `likes_count` for a given emoji

- `decrement(row_id bigint)`  
  Decrements `likes_count`, down to a minimum of 0

Functions are used via:

```ts
supabase.rpc('increment', { row_id: emojiId });
supabase.rpc('decrement', { row_id: emojiId });
````

### 📌 Important Notes
- Ensure .env is properly configured (see [.env.example](.env.example)).
- Supabase schema is fully versioned via /supabase/migrations/
- Emoji likes use database functions to avoid race conditions and ensure accuracy
- Authenticated endpoints require Clerk session tokens
- Supabase storage must have public read access for emojis to render in the frontend
- Replicate usage may incur costs or rate limits
