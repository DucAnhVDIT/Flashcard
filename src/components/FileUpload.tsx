'use client'
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/types';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Folder } from 'lucide-react';

interface FileUploadProps {
    onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  }

export function FileUpload({ onFlashcardsGenerated }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
      
      const generatedFlashcards = await generateFlashcardsWithAI(text);
      console.log('Generated flashcards:', generatedFlashcards);
      onFlashcardsGenerated(generatedFlashcards);
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

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file.');
    }
  }, []);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const generateFlashcardsWithAI = async (text: string): Promise<Flashcard[]> => {
    const maxRetries = 3;
    let retries = 0;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (retries < maxRetries) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that generates flashcards from given text."
              },
              {
                role: "user",
                content: `Generate flashcards from the following text. Format the output as a JSON array of objects, each with 'question' and 'answer' properties: ${text}`
              }
            ],
          }),
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * Math.pow(2, retries);
          console.log(`Rate limited. Retrying after ${delayMs}ms`);
          await delay(delayMs);
          retries++;
          continue;
        }

        if (!response.ok) {
          throw new Error(`Failed to generate flashcards: ${response.statusText}`);
        }

        const data = await response.json();
        const flashcardsData = JSON.parse(data.choices[0].message.content);
        return flashcardsData.map((card: any, index: number) => ({
          id: `card-${index}`,
          question: card.question,
          answer: card.answer,
        }));
      } catch (error) {
        console.error('Error generating flashcards:', error);
        if (retries === maxRetries - 1) {
          return [];
        }
        retries++;
        await delay(1000 * Math.pow(2, retries));
      }
    }

    return [];
  };

  const generateFlashcards = (text: string): Flashcard[] => {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const flashcards: Flashcard[] = [];

    for (let i = 0; i < sentences.length; i += 2) {
      if (i + 1 < sentences.length) {
        flashcards.push({
          id: `card-${i}`,
          question: sentences[i].trim(),
          answer: sentences[i + 1].trim()
        });
      }
    }

    return flashcards;
  };

  return (
    <div className="w-80 bg-white rounded-3xl shadow-lg p-6 mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Upload your files</h2>
      <p className="text-gray-500 text-center mb-6">PDF (MAX. 10MB)</p>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed ${
          isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
        } rounded-2xl p-8 flex flex-col items-center transition-colors duration-300`}
      >
        <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
          <div className="bg-orange-100 rounded-full p-4 mb-4">
            <Folder className="w-12 h-12 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Click to upload or drag and drop
          </p>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept=".pdf"
            className="hidden"
          />
        </label>
      </div>
      {file && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          Selected file: {file.name}
        </p>
      )}
      <Button
        onClick={handleUpload}
        disabled={!file}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
      >
        Upload and Process
      </Button>
    </div>
  );
}