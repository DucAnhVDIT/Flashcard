export interface Folder {
    id: string;
    name: string;
    flashcards: Flashcard[];
  }
  
  export interface Flashcard {
    id: string;
    question: string;
    answer: string;
  }