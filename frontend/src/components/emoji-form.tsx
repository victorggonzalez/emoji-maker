import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { API_URL } from "../config";
import { Loader2 } from "lucide-react"; // Import the Loader2 icon from lucide-react

interface UserProfile {
  user_id: string;
  credits: number;
  tier: string;
}

interface EmojiFormProps {
  onEmojiGenerated: () => void;
  userProfile: UserProfile | null;
}

export function EmojiForm({ onEmojiGenerated, userProfile }: EmojiFormProps) {
  const { getToken } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const api = axios.create({
        timeout: 300000, // 5 minutes
      });
      await api.post(
        `${API_URL}/api/generate-emoji`,
        {
          input: {
            prompt,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onEmojiGenerated(); // Call this function after successful generation
      setPrompt(""); // Clear the input after successful generation
    } catch (error) {
      console.error("Error generating emoji:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError("The request timed out. Please try again.");
        } else if (error.response) {
          setError(`Error: ${error.response.data.error || 'An unexpected error occurred'}`);
        } else if (error.request) {
          setError("No response received from the server. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !prompt || prompt.length < 3 || (userProfile && userProfile.credits <= 0);

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate a new emoji"
          required
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-sm text-gray-600">Generating your emoji...</p>
          </div>
        ) : (
          <Button type="submit" disabled={!!isButtonDisabled} className="w-full">
            Generate
          </Button>
        )}
        {userProfile && userProfile.credits <= 0 && (
          <p className="text-red-500 mt-2">You have no credits left. You cannot generate new emojis.</p>
        )}
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </form>
    </Card>
  );
}
