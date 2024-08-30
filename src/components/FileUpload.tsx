'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/types';
import * as pdfjsLib from 'pdfjs-dist';

interface FileUploadProps {
    onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  }

export function FileUpload({ onFlashcardsGenerated }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const loadWorker = async () => {
      const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
    };
    loadWorker();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      console.log('Extracted text:', text);
      // TODO: Process the extracted text and generate flashcards
      // onFlashcardsGenerated(generatedFlashcards);
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  };

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".pdf" 
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
      <Button onClick={handleUpload} disabled={!file}>
        Upload and Process
      </Button>
    </div>
  );
}