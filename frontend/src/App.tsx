import { useState, useEffect, useCallback } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Header from "./components/headers";
import { EmojiGrid } from "./components/emoji-grid";
import { EmojiForm } from "./components/emoji-form";
import { API_URL } from "./config";
import "./App.css";

interface UserProfile {
  user_id: string;
  credits: number;
  tier: string;
}

function App() {
  const [shouldRefetchEmojis, setShouldRefetchEmojis] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { isSignedIn, getToken } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/initialize-user`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUserProfile(data.profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleEmojiGenerated = () => {
    setShouldRefetchEmojis(prev => !prev);
    fetchUserProfile();
  };

  return (
    <div className="App">
      <Header userProfile={userProfile} />
      <div className="container mx-auto px-4 py-8">
        <SignedIn>
          <EmojiForm onEmojiGenerated={handleEmojiGenerated} userProfile={userProfile} />
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
