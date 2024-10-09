import { useState, useEffect, useCallback } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Header from "./components/headers";
import { EmojiGrid } from "./components/emoji-grid";
import { EmojiForm } from "./components/emoji-form";
import { API_URL } from "./config";
import "./App.css";
import "./custom-scrollbar.css";

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
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
      <Header userProfile={userProfile} />
      <main className="flex-grow w-full pt-24">
        <div className="container mx-auto px-4 flex flex-col h-full max-w-7xl">
          <SignedIn>
            <div className="mb-4 sticky top-20 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 z-10 pb-4">
              <EmojiForm onEmojiGenerated={handleEmojiGenerated} userProfile={userProfile} />
            </div>
            <div className="flex-grow overflow-auto custom-scrollbar">
              <EmojiGrid shouldRefetch={shouldRefetchEmojis} />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="text-center bg-white bg-opacity-80 p-8 rounded-lg shadow-md">
              <p className="text-xl mb-4 text-purple-600">Welcome to Emoj maker!</p>
              <p className="text-gray-600">Sign in to start creating and interacting with emojis.</p>
            </div>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}

export default App;
