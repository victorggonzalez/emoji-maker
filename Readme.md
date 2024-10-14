# AI Emoji Maker

AI Emoji Maker is a full-stack web application that allows users to generate custom emojis using AI technology. The app consists of a React-based frontend and a Node.js backend, providing a seamless experience for creating, managing, and interacting with AI-generated emojis.

## Project Overview

The AI Emoji Maker application combines modern web technologies to offer users an intuitive platform for emoji creation and management. It leverages AI capabilities to generate unique emojis based on user prompts, while also providing features like user authentication, emoji storage, and social interactions.

## Tech Stack

### Frontend
- React with TypeScript
- Vite (build tool)
- Tailwind CSS
- Shadcn UI components
- Clerk (authentication)
- Axios (API requests)

### Backend
- Node.js
- Express.js
- Supabase (database and storage)
- Clerk (authentication)
- Replicate (AI emoji generation)

## Key Features

1. **User Authentication**: Secure sign-up and login functionality using Clerk.
2. **AI Emoji Generation**: Users can input prompts to generate custom emojis using Replicate's AI model.
3. **Emoji Management**: View, like, download, and delete emojis in a responsive grid layout.
4. **Credit System**: Users have a limited number of credits for generating emojis.
5. **Real-time Interactions**: Like and unlike emojis with immediate updates.
6. **Responsive Design**: Optimized for various device sizes.

## Project Structure

The project is divided into two main parts:

1. **Frontend**: Located in the `frontend/` directory, containing React components, styles, and configuration.
2. **Backend**: Located in the `backend/` directory, handling API requests, database operations, and AI integration.

## Setup and Deployment

### Frontend
1. Navigate to the `frontend/` directory
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

### Backend
1. Navigate to the `backend/` directory
2. Install dependencies: `npm install`
3. Set up environment variables
4. For local development: `vercel dev`
5. Deploy: `vercel`

## API Endpoints

- `POST /api/generate-emoji`: Generate a new emoji
- `POST /api/upload-emoji`: Upload a pre-generated emoji
- `POST /api/like-emoji`: Like an emoji
- `POST /api/unlike-emoji`: Unlike an emoji
- `GET /api/emojis`: Fetch all emojis
- `POST /api/initialize-user`: Initialize a new user profile
- `DELETE /api/delete-emoji/:emojiId`: Delete an emoji (owner only)

## Important Notes

- The backend uses a custom timeout configuration for long-running emoji generation tasks.
- User authentication is required for most API endpoints.
- The application manages user credits for emoji generation.
- Emoji generation relies on Replicate's AI model, which may have usage limits or associated costs.

For more detailed information on each part of the application, please refer to the README files in the `frontend/` and `backend/` directories, as well as the source code and comments within each file.

