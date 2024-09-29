import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Download, Upload } from "lucide-react";
import axios from "axios";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
  liked: boolean; // Added to track user likes
}

interface EmojiGridProps {
  shouldRefetch: boolean;
}

export function EmojiGrid({ shouldRefetch }: EmojiGridProps) {
  const { isSignedIn, getToken } = useAuth();
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmojis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/api/emojis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch emojis');
      }
      const data = await response.json();
      setEmojis(data);
    } catch (err) {
      console.error("Error fetching emojis:", err);
      setError("Failed to load emojis. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn) {
      fetchEmojis();
    }
  }, [isSignedIn, fetchEmojis, shouldRefetch]);

  const toggleLike = async (emoji: Emoji) => {
    const endpoint = emoji.liked ? '/api/unlike-emoji' : '/api/like-emoji';
    
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emojiId: emoji.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to update like');
      }
      const data = await response.json();
      setEmojis(prevEmojis => 
        prevEmojis.map(e => 
          e.id === emoji.id 
            ? { ...e, likes_count: data.likes, liked: !e.liked } 
            : e
        )
      );
    } catch (err) {
      console.error("Error updating like:", err);
      // Optionally, show an error message to the user
    }
  };

  const handleDownload = (emoji: string) => {
    fetch(emoji)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // Extract file name from the URL or use a default name
        const fileName = emoji.split("/").pop() || "emoji.png";
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Error downloading emoji:", error));
  };

  const handleUpload = async (emoji: string) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:3001/api/upload-emoji",
        { imageUrl: emoji },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Emoji uploaded successfully:", response.data);
      // Optionally, you can show a success message to the user
    } catch (error) {
      console.error("Error uploading emoji:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleNewEmojiAdded = useCallback(() => {
    fetchEmojis();
  }, [fetchEmojis]);

  if (!isSignedIn) {
    return null; // or return a message asking to sign in
  }

  if (isLoading) {
    return <div>Loading emojis...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {emojis.map((emoji) => (
          <Card key={emoji.id} className="relative group">
            <img src={emoji.image_url} alt={emoji.prompt} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLike(emoji)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    emoji.liked ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(emoji.image_url)}
              >
                <Download className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUpload(emoji.image_url)}
              >
                <Upload className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded">
              Likes: {emoji.likes_count}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
