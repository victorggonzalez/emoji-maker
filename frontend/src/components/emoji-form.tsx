import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { API_URL } from "../config";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      await axios.post(
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
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !prompt || prompt.length < 3;

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for the emoji"
          required
        />
        <Button type="submit" disabled={!!isButtonDisabled}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
        {userProfile && userProfile.credits <= 0 && (
          <p className="text-red-500 mt-2">You have no credits left. You cannot generate new emojis.</p>
        )}
      </form>
    </Card>
  );
}
