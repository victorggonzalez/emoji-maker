import { useState } from 'react'
import { EmojiForm } from './components/emoji-form'
import { EmojiGrid } from './components/emoji-grid'
import './App.css'
// Generate dummy emojis for testing
const dummyEmojis = [
  'https://replicate.delivery/pbxt/KjyX44ZrOJ5PDhYeNF9olNY5T1cnOoGofTZWedIvvs3MNBDnA/out-0.png',
  'https://replicate.delivery/pbxt/ZUeQOuiN390WNyjTuLa6etQER3Nkeefe12msiaNwD1Ju1JY4E/out-0.png',
  'https://replicate.delivery/pbxt/woI1FBrfvyUZFasQovDeGI8rG0eZ3e02ioemOy4iOKRt1LMcC/out-0.png',
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
