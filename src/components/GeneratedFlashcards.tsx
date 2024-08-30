'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flashcard, Folder } from '@/types/types';


interface GeneratedFlashcardsProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onSaveToFolder: (folderId: string, flashcards: Flashcard[]) => void;
}

export function GeneratedFlashcards({ flashcards, folders, onSaveToFolder }: GeneratedFlashcardsProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleSaveToFolder = () => {
    if (selectedFolder) {
      onSaveToFolder(selectedFolder, flashcards);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generated Flashcards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id}>
            <CardContent className="p-4">
              <p className="font-semibold">Q: {flashcard.question}</p>
              <p>A: {flashcard.answer}</p>
            </CardContent>
          </Card>
        ))}
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