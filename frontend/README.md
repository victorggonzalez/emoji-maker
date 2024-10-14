# AI Emoji Maker Frontend

This is the frontend for the AI Emoji Maker web application. It's built using React, Vite, and integrates with various libraries to provide a seamless user experience for generating and interacting with AI-powered emojis.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Lucide React (for icons)
- Clerk (for authentication)
- Axios (for API requests)

## Features

1. **User Authentication**: Utilizes Clerk for secure user sign-in and management.
2. **Emoji Generation**: Allows users to input prompts and generate custom emojis using AI.
3. **Emoji Grid**: Displays all generated emojis in a responsive grid layout.
4. **Emoji Interactions**: Users can like, download, and delete their own emojis.
5. **Credit System**: Tracks and displays user credits for generating emojis.
6. **Responsive Design**: Ensures a great user experience across various device sizes.

## Project Structure

- `src/components`: Contains all React components
  - `ui/`: Reusable UI components (Button, Card, Input)
  - `emoji-card.tsx`: Individual emoji display component
  - `emoji-form.tsx`: Form for generating new emojis
  - `emoji-grid.tsx`: Grid display of all emojis
  - `headers.tsx`: Application header with authentication controls
- `src/lib`: Utility functions
- `src/types`: TypeScript type definitions
- `src/config.ts`: Configuration file for API URL
- `src/App.tsx`: Main application component
- `src/main.tsx`: Entry point of the application

## Setup and Running

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root of the frontend directory
   - Add the following variables:
     ```
     VITE_API_URL=your_backend_api_url
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     ```
4. Run the development server:
   ```
   npm run dev
   ```
5. For production build:
   ```
   npm run build
   ```

## Additional Notes

- The project uses Tailwind CSS for styling. Custom styles can be added in `src/index.css`.
- Custom scrollbar styles are defined in `src/custom-scrollbar.css`.
- The application is set up to work with a backend API. Ensure the backend is running and the `VITE_API_URL` is set correctly.

For more detailed information on the implementation, please refer to the source code and comments within each file.
