'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/types';


export function FileUpload({ onFlashcardsGenerated }: { onFlashcardsGenerated: (flashcards: Flashcard[]) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsGenerating(true);
    
    // Simulate flashcard generation
    // In a real application, you'd process the file and generate flashcards here
    setTimeout(() => {
      const generatedFlashcards: Flashcard[] = [
        { id: '1', question: `Question from ${file.name} 1`, answer: 'Answer 1' },
        { id: '2', question: `Question from ${file.name} 2`, answer: 'Answer 2' },
        { id: '3', question: `Question from ${file.name} 3`, answer: 'Answer 3' },
      ];
      
      onFlashcardsGenerated(generatedFlashcards);
      setIsGenerating(false);
      setFile(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="w-full">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Choose a file
        </label>
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          onChange={handleFileChange} 
          accept=".pdf,.txt,.md" 
        />
      </div>
      {file && (
        <p className="text-sm text-gray-500">
          Selected file: {file.name}
        </p>
      )}
      <Button 
        onClick={handleUpload} 
        disabled={!file || isGenerating} 
        className="w-full"
      >
        {isGenerating ? 'Generating Flashcards...' : 'Generate Flashcards'}
      </Button>
    </div>
  );
}