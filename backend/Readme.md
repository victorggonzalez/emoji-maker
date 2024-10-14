# Emoji Maker Backend

This is the backend for the Emoji Maker web application. It's built using Node.js, Express.js, Supabase, and Clerk for authentication.

## Project Overview

The Emoji Maker backend handles user authentication, emoji generation, storage, and interaction. It integrates with Replicate for AI-powered emoji generation and Supabase for data storage.

## Tech Stack

- Node.js
- Express.js
- Supabase (for database and storage)
- Clerk (for authentication)
- Replicate (for AI emoji generation)

## Key Features

1. **User Authentication**: Uses Clerk for user authentication and creates/manages user profiles in Supabase.

2. **Emoji Generation**: Integrates with Replicate's AI model to generate custom emojis based on user prompts.

3. **Emoji Storage**: Uploads generated emojis to Supabase storage and stores metadata in the database.

4. **Emoji Interaction**: Handles likes and unlikes for emojis, updating the like count in real-time.

5. **User Credits**: Manages user credits for generating emojis, deducting credits as they're used.

## API Endpoints

- `POST /api/generate-emoji`: Generate a new emoji
- `POST /api/upload-emoji`: Upload a pre-generated emoji
- `POST /api/like-emoji`: Like an emoji
- `POST /api/unlike-emoji`: Unlike an emoji
- `GET /api/emojis`: Fetch all emojis
- `POST /api/initialize-user`: Initialize a new user profile
- `DELETE /api/delete-emoji/:emojiId`: Delete an emoji (owner only)

## Setup and Deployment

This backend is designed to be deployed on Vercel. It uses a custom server configuration to handle long-running tasks like emoji generation.

To set up and deploy:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. For local development, use `vercel dev`
5. To deploy, use `vercel`

## Important Notes

- The app uses a custom timeout configuration to handle long-running emoji generation tasks.
- User authentication is required for most API endpoints.
- The app manages user credits, allowing users to generate a limited number of emojis.
- Emoji generation is done using Replicate's AI model, which may have usage limits or costs associated with it.

For more detailed information on the implementation, please refer to the source code and comments within each file.

