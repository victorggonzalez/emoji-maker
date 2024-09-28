import { useState } from 'react'
import { EmojiForm } from './components/emoji-form'
import { EmojiGrid } from './components/emoji-grid'
import './App.css'
// Generate dummy emojis for testing
const dummyEmojis = [
  'https://replicate.delivery/pbxt/IJzVzqNZCdBUxKsLOQdxGxLc5OiTYqnGnZrMZWIiOixdE4CC/out-0.png',
  'https://replicate.delivery/pbxt/KJ8zVqNZCdBUxKsLOQdxGxLc5OiTYqnGnZrMZWIiOixdE4CC/out-1.png',
  'https://replicate.delivery/pbxt/LK9zVqNZCdBUxKsLOQdxGxLc5OiTYqnGnZrMZWIiOixdE4CC/out-2.png',
  'https://replicate.delivery/pbxt/ML0zVqNZCdBUxKsLOQdxGxLc5OiTYqnGnZrMZWIiOixdE4CC/out-3.png',
]

function App() {
  const [emojis, setEmojis] = useState<string[]>(dummyEmojis)

  const handleEmojiGenerated = (newEmoji: string) => {
    setEmojis((prevEmojis) => [...prevEmojis, newEmoji])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Emoj maker</h1>
      <EmojiForm onEmojiGenerated={handleEmojiGenerated} />
      <EmojiGrid emojis={emojis} />
    </div>
  )
}

export default App
