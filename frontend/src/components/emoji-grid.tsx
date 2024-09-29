import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Download, Upload } from "lucide-react";
import axios from "axios";

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  const { isSignedIn } = useAuth();
  
  const { getToken } = useAuth();
  const [emojiLikes, setEmojiLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch('http://localhost:3001/api/emoji-likes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch emoji likes');
        }
        const data = await response.json();
        setEmojiLikes(data);
      } catch (err) {
        console.error("Error fetching emoji likes:", err);
        setError("Failed to load likes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [getToken]);

  const toggleLike = async (emoji: string) => {
    const isLiked = emojiLikes[emoji] && emojiLikes[emoji] > 0;
    const endpoint = isLiked ? '/api/unlike-emoji' : '/api/like-emoji';
    
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emojiUrl: emoji }),
      });
      if (!response.ok) {
        throw new Error('Failed to update like');
      }
      const data = await response.json();
      setEmojiLikes(prev => ({
        ...prev,
        [emoji]: data.likes,
      }));
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

  if (!isSignedIn) {
    return null; // or return a message asking to sign in
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...emojis].reverse().map((emoji, index) => (
          <Card key={index} className="relative group">
            <img src={emoji} alt="Generated Emoji" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLike(emoji)}
                disabled={isLoading}
              >
                <Heart
                  className={`h-6 w-6 ${
                    emojiLikes[emoji] && emojiLikes[emoji] > 0 ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(emoji)}
              >
                <Download className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUpload(emoji)}
              >
                <Upload className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded">
              {isLoading ? (
                "Loading likes..."
              ) : error ? (
                "Error loading likes"
              ) : (
                `Likes: ${emojiLikes[emoji] || 0}`
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
