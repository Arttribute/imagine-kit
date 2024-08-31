import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WordSelector({
  words,
  correctWords,
  isCorrect,
  wrongAttempts,
  setIsCorrect,
  setWrongAttempts,
}: {
  words: string[];
  correctWords: string[];
  isCorrect: boolean;
  wrongAttempts: number;
  setIsCorrect: (isCorrect: boolean) => void;
  setWrongAttempts: (wrongAttempts: number) => void;
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>(words);
  const [emptySlots, setEmptySlots] = useState(correctWords.length);

  useEffect(() => {
    if (selectedWords.length === correctWords.length) {
      checkCorrectness();
    }
  }, [selectedWords.length, correctWords.length]);

  const handleOptionClick = (word: string) => {
    if (selectedWords.length < correctWords.length) {
      setSelectedWords([...selectedWords, word]);
      setWordOptions(wordOptions.filter((w) => w !== word));
      setEmptySlots(emptySlots - 1);
    }
  };

  const handleSelectedWordClick = (word: string) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    const newWordOptions = [...wordOptions, word].sort(
      (a, b) => words.indexOf(a) - words.indexOf(b)
    );
    setWordOptions(newWordOptions);
    setEmptySlots(emptySlots + 1);
  };

  const checkCorrectness = () => {
    if (selectedWords.join(" ") === correctWords.join(" ")) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setWrongAttempts(wrongAttempts + 1);
    }
  };

  return (
    <div>
      <div className="flex">
        {selectedWords.map((word, index) => (
          <Button
            variant="ghost"
            key={index}
            className={`m-1 rounded-md border bg-yellow-50 border px-0.5 py-0.5 ${
              selectedWords.length === correctWords.length
                ? isCorrect
                  ? "border-green-500"
                  : "border-red-500 animate-shake"
                : "border-slate-500"
            }`}
            onClick={() => handleSelectedWordClick(word)}
          >
            <div className="px-4 bg-white border py-1.5 rounded-sm">
              <p className="font-medium">{word}</p>
            </div>
          </Button>
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={index}
            className="px-4 p-1 m-1 rounded-md border border-slate-500 bg-yellow-50 py-4"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-12">
        {wordOptions.map((wordoption: string, index: number) => (
          <Button
            key={index}
            variant="ghost"
            className="px-6 m-1 rounded-md border bg-slate-50 col-span-3 text-center"
            onClick={() => handleOptionClick(wordoption)}
          >
            <p className="font-medium">{wordoption}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
