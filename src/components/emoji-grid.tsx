import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Heart, Download } from 'lucide-react'

interface EmojiGridProps {
  emojis: string[]
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  const [likedEmojis, setLikedEmojis] = useState<Set<string>>(new Set())

  const toggleLike = (emoji: string) => {
    setLikedEmojis((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(emoji)) {
        newSet.delete(emoji)
      } else {
        newSet.add(emoji)
      }
      return newSet
    })
  }

  const handleDownload = (emoji: string) => {
    // Implement download functionality
    console.log('Downloading:', emoji)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <Card key={index} className="relative group">
          <img src={emoji} alt="Generated Emoji" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleLike(emoji)}
            >
              <Heart
                className={`h-6 w-6 ${
                  likedEmojis.has(emoji) ? 'fill-current text-red-500' : ''
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
          </div>
        </Card>
      ))}
    </div>
  )
}
