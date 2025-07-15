import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { API_URL } from "../config";
import { EmojiCard } from "./emoji-card";
import { Loader2, Sparkles, Plus, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Emoji } from "../types/emoji";

interface EmojiGridProps {
  shouldRefetch: boolean;
}

export function EmojiGrid({ shouldRefetch }: EmojiGridProps) {
  const { isSignedIn, getToken } = useAuth();
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEmojis = useCallback(
    async (showRefreshLoader = false) => {
      if (!isSignedIn) return;

      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/emojis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch emojis");
        }

        const data = await response.json();
        setEmojis(data);
      } catch (err) {
        console.error("Error fetching emojis:", err);
        setError("Failed to load emojis. Please try again later.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getToken, isSignedIn]
  );

  useEffect(() => {
    fetchEmojis(true);
  }, [fetchEmojis, shouldRefetch]);

  const handleRefresh = () => {
    fetchEmojis(true);
  };

  const toggleLike = async (emoji: Emoji) => {
    const endpoint = emoji.liked ? "/api/unlike-emoji" : "/api/like-emoji";

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emojiId: emoji.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      setEmojis((prevEmojis) =>
        prevEmojis.map((e) =>
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

  const handleDelete = async (emojiId: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/delete-emoji/${emojiId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete emoji");
      }

      setEmojis((prevEmojis) =>
        prevEmojis.filter((emoji) => emoji.id !== emojiId)
      );
    } catch (err) {
      console.error("Error deleting emoji:", err);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
          <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-pulse" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-gray-900">
          Loading your magical emojis...
        </h3>
        <p className="mt-2 text-gray-600">This might take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">{error}</p>
        <Button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (emojis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
          <Plus className="h-10 w-10 text-purple-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your emoji collection is empty!
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Create your first magical emoji using the form above. Let your
          creativity shine!
        </p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {emojis.map((emoji) => (
          <EmojiCard
            key={emoji.id}
            emoji={emoji}
            onLike={toggleLike}
            onDownload={handleDownload}
            onUpload={handleUpload}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Load more placeholder for future pagination */}
      {emojis.length > 0 && (
        <div className="flex justify-center pt-8">
          <div className="text-gray-500 text-sm">
            ✨ You've reached the end of your collection
          </div>
        </div>
      )}
    </div>
  );
}
