'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FlashcardProps {
  question: string;
  answer: string;
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Card className="w-64 h-40 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <CardContent className="flex items-center justify-center h-full">
        {isFlipped ? answer : question}
      </CardContent>
    </Card>
  )
}
