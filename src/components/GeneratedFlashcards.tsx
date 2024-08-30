'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flashcard, Folder } from '@/types/types';

interface GeneratedFlashcardsProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onSaveToFolder: (folderId: string, flashcards: Flashcard[]) => void;
}

export function GeneratedFlashcards({ flashcards, folders, onSaveToFolder }: GeneratedFlashcardsProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const handleSaveToFolder = () => {
    if (selectedFolder) {
      onSaveToFolder(selectedFolder, flashcards);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false);
    setUserAnswer('');
  };

  const handleSubmitAnswer = () => {
    setIsFlipped(true);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Generated Flashcards</h2>
      
      <Card className="w-full h-64 perspective relative">
        <CardContent 
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-4 text-center">
            <p className="text-lg font-semibold">{currentCard.question}</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-lg font-semibold">Correct Answer:</p>
            <p className="text-lg">{currentCard.answer}</p>
            <p className="text-md mt-4">Your Answer:</p>
            <p className="text-md italic">{userAnswer}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Input
          placeholder="Type your answer here"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full"
          disabled={isFlipped}
        />
        <div className="flex justify-between">
          {!isFlipped ? (
            <Button onClick={handleSubmitAnswer} disabled={!userAnswer.trim()}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextCard}>Next Card</Button>
          )}
        </div>
      </div>

      <div className="flex space-x-4 items-center">
        <Select onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map(folder => (
              <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSaveToFolder} disabled={!selectedFolder}>
          Save to Folder
        </Button>
      </div>
    </div>
  );
}