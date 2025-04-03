
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌'],
  love: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓'],
  gestures: ['👍', '👎', '👏', '🙌', '🤝', '👊', '✌️', '🤞', '🤘', '🤙', '👈', '👉', '👆', '👇'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍'],
  activities: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🎯', '🎮'],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('smileys');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectEmoji = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Smile className="h-5 w-5" />
          <span className="sr-only">Emoji picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2 border-b pb-2">
            <h3 className="text-sm font-medium">Emojis</h3>
            <div className="flex space-x-1">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${activeCategory === category ? 'bg-slate-100' : ''}`}
                  onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                >
                  {category === 'smileys' ? '😊' : 
                   category === 'love' ? '❤️' : 
                   category === 'gestures' ? '👍' : 
                   category === 'animals' ? '🐶' : 
                   category === 'food' ? '🍎' : '🎮'}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-8 gap-1 max-h-[200px] overflow-y-auto">
            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleSelectEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
