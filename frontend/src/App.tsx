import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Header from "./components/headers";
import { EmojiGrid } from "./components/emoji-grid";
import { EmojiForm } from "./components/emoji-form";
import "./App.css";

function App() {
  const [shouldRefetchEmojis, setShouldRefetchEmojis] = useState(false);

  const handleEmojiGenerated = () => {
    setShouldRefetchEmojis(prev => !prev);
  };

  return (
    <div className="App">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SignedIn>
          <EmojiForm onEmojiGenerated={handleEmojiGenerated} />
          <br />
          <EmojiGrid shouldRefetch={shouldRefetchEmojis} />
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
