import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { API_URL } from "../config";
import { Loader2, Wand2 } from "lucide-react";

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
    <Card className="p-6 bg-white bg-opacity-80 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your emoji..."
            required
            disabled={isLoading}
            className="pl-10 pr-4 py-2 border-2 border-purple-300 focus:border-purple-500 rounded-full"
          />
          <Wand2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            <p className="text-sm text-purple-600">Crafting your magical emoji...</p>
          </div>
        ) : (
          <Button 
            type="submit" 
            disabled={isButtonDisabled} 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Generate Emoji
          </Button>
        )}
        {userProfile && userProfile.credits <= 0 && (
          <p className="text-red-500 mt-2 text-center">You're out of magic! No more credits left.</p>
        )}
        {error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}
      </form>
    </Card>
  );
}
