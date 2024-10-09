import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Download, Upload } from "lucide-react";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  liked: boolean;
}

interface EmojiCardProps {
  emoji: Emoji;
  onLike: (emoji: Emoji) => Promise<void>;
  onDownload: (imageUrl: string) => void;
  onUpload: (imageUrl: string) => Promise<void>;
}

export function EmojiCard({
  emoji,
  onLike,
  onDownload,
  onUpload,
}: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isProduction = import.meta.env.MODE === "production";

  return (
    <Card
      className="relative group w-64 h-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={emoji.image_url}
        alt={emoji.prompt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onLike(emoji)}>
            <Heart
              className={`h-6 w-6 ${
                emoji.liked ? "fill-current text-red-500" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(emoji.image_url)}
          >
            <Download className="h-6 w-6" />
          </Button>
          {!isProduction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpload(emoji.image_url)}
            >
              <Upload className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 px-2 py-1 text-sm">
        <div className="flex justify-between items-center">
          <span>Likes: {emoji.likes_count}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHovered(!isHovered)}
          >
            {isHovered ? "Hide" : "Details"}
          </Button>
        </div>
        {isHovered && (
          <p className="mt-1 text-xs line-clamp-2" title={emoji.prompt}>
            {emoji.prompt}
          </p>
        )}
      </div>
    </Card>
  );
}
