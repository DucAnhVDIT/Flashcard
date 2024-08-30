'use client'
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Flashcard, Folder } from '@/types/types';
import { GeneratedFlashcards } from '@/components/GeneratedFlashcards';


export default function Home() {
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Math', flashcards: [] },
    { id: '2', name: 'Science', flashcards: [] },
    { id: '3', name: 'History', flashcards: [] },
  ]);

  const handleFlashcardsGenerated = (flashcards: Flashcard[]) => {
    setGeneratedFlashcards(flashcards);
  };

  const handleSaveToFolder = (folderId: string, flashcards: Flashcard[]) => {
    setFolders(folders.map(folder => 
      folder.id === folderId
        ? { ...folder, flashcards: [...folder.flashcards, ...flashcards] }
        : folder
    ));
    setGeneratedFlashcards([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcard Generator</h1>
        <p className="text-lg text-gray-600">Upload your study material and create flashcards instantly</p>
      </div>
      <FileUpload onFlashcardsGenerated={handleFlashcardsGenerated} />
      {generatedFlashcards.length > 0 && (
        <GeneratedFlashcards 
          flashcards={generatedFlashcards} 
          folders={folders} 
          onSaveToFolder={handleSaveToFolder} 
        />
      )}
    </main>
  );
}