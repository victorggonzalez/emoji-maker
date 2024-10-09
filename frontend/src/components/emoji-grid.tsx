import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { API_URL } from "../config";
import { EmojiPlaceholder } from "./emoji-placeholder";
import { EmojiCard } from "./emoji-card";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
  liked: boolean;
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
    if (!isSignedIn) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/emojis`, {
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
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchEmojis();
  }, [fetchEmojis, shouldRefetch]);

  const toggleLike = async (emoji: Emoji) => {
    const endpoint = emoji.liked ? '/api/unlike-emoji' : '/api/like-emoji';
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
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
        `${API_URL}/api/upload-emoji`,
        { imageUrl: emoji },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Emoji uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading emoji:", error);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <EmojiPlaceholder key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (emojis.length === 0) {
    return <div className="text-center">No emojis found. Create your first emoji!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <EmojiCard
          key={emoji.id}
          emoji={emoji}
          onLike={toggleLike}
          onDownload={handleDownload}
          onUpload={handleUpload}
        />
      ))}
    </div>
  );
}
