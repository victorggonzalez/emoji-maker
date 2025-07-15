import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Download, Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Emoji } from "../types/emoji";

interface EmojiCardProps {
  emoji: Emoji;
  onLike: (emoji: Emoji) => Promise<void>;
  onDownload: (imageUrl: string) => void;
  onUpload: (imageUrl: string) => Promise<void>;
  onDelete: (emojiId: number) => Promise<void>;
}

export function EmojiCard({
  emoji,
  onLike,
  onDownload,
  onUpload,
  onDelete,
}: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isProduction = import.meta.env.MODE === "production";
  const { userId } = useAuth();
  const isCreator = emoji.creator_user_id === userId;

  const handleLike = async () => {
    setIsLikeLoading(true);
    try {
      await onLike(emoji);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await onDelete(emoji.id);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main emoji image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl">
        <img
          src={emoji.image_url}
          alt={emoji.prompt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Action buttons overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex space-x-2">
            {/* Like button */}
            <Button
              onClick={handleLike}
              disabled={isLikeLoading}
              size="sm"
              className={`h-10 w-10 rounded-full shadow-lg transition-all duration-200 ${
                emoji.liked
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/90 hover:bg-white text-gray-700 hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${emoji.liked ? "fill-current" : ""}`}
              />
            </Button>

            {/* Download button */}
            <Button
              onClick={() => onDownload(emoji.image_url)}
              size="sm"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 shadow-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Upload button (non-production) */}
            {!isProduction && (
              <Button
                onClick={() => onUpload(emoji.image_url)}
                size="sm"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-green-500 shadow-lg transition-all duration-200"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}

            {/* Delete button (creator only) */}
            {isCreator && (
              <Button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                size="sm"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 shadow-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Likes count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart
              className={`h-4 w-4 ${
                emoji.liked ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {emoji.likes_count}
            </span>
          </div>

          {/* Toggle details button */}
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            {expanded ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Details
              </>
            )}
          </Button>
        </div>

        {/* Prompt (expanded state) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            expanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              {emoji.prompt}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
