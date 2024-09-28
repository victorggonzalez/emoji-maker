import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Header from "./components/headers";
import { EmojiGrid } from "./components/emoji-grid";
import { EmojiForm } from "./components/emoji-form";
import "./App.css";

// Generate dummy emojis for testing
const dummyEmojis = [
  "https://replicate.delivery/pbxt/KjyX44ZrOJ5PDhYeNF9olNY5T1cnOoGofTZWedIvvs3MNBDnA/out-0.png",
  "https://replicate.delivery/pbxt/ZUeQOuiN390WNyjTuLa6etQER3Nkeefe12msiaNwD1Ju1JY4E/out-0.png",
  "https://replicate.delivery/pbxt/woI1FBrfvyUZFasQovDeGI8rG0eZ3e02ioemOy4iOKRt1LMcC/out-0.png",
];

function App() {
  const [emojis, setEmojis] = useState<string[]>(dummyEmojis);

  const handleEmojiGenerated = (newEmoji: string) => {
    setEmojis((prevEmojis) => [...prevEmojis, newEmoji]);
  };

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SignedIn>
          <EmojiForm onEmojiGenerated={handleEmojiGenerated} />
          <br />
          <EmojiGrid emojis={emojis} />
        </SignedIn>
        <SignedOut>
          <div className="text-center">
            <p className="text-xl mb-4">Welcome to Emoj maker!</p>
            <p>Sign in to start creating and interacting with emojis.</p>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

export default App;
