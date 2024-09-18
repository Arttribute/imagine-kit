"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WordSelector({
  correctWords,
  incorrectWords,
}: {
  correctWords: string | string[];
  incorrectWords: string | string[];
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [emptySlots, setEmptySlots] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // Ensure correctWords and incorrectWords are arrays
  const correctWordsArray = Array.isArray(correctWords)
    ? correctWords
    : correctWords.split(" ");
  const incorrectWordsArray = Array.isArray(incorrectWords)
    ? incorrectWords
    : incorrectWords.split(" ");

  useEffect(() => {
    setWordOptions(
      [...correctWordsArray, ...incorrectWordsArray].sort(
        () => Math.random() - 0.5
      )
    );
    setWords([...correctWordsArray, ...incorrectWordsArray]);
    setEmptySlots(correctWordsArray.length);
  }, [correctWords, incorrectWords]); // Dependency array listens to changes

  useEffect(() => {
    if (selectedWords.length === correctWordsArray.length) {
      checkCorrectness();
    }
  }, [selectedWords.length, correctWordsArray.length]);

  const handleOptionClick = (word: string) => {
    if (selectedWords.length < correctWordsArray.length) {
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
    const correctJoined = Array.isArray(correctWords)
      ? correctWords.join(" ")
      : correctWords;

    if (selectedWords.join(" ") === correctJoined) {
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
              selectedWords.length === correctWordsArray.length
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
