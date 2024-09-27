"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WordSelectorPreview from "@/components/imaginekit/previews/WordSelectorPreview";
import { Loader2 } from "lucide-react";

export default function WordSelector({
  correctWords,
  incorrectWords,
  loading,
}: {
  correctWords: string | string[];
  incorrectWords: string | string[];
  loading: boolean;
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [emptySlots, setEmptySlots] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // Ensure correctWords and incorrectWords exist and are arrays

  const correctWordsArray = !correctWords
    ? null
    : Array.isArray(correctWords)
    ? correctWords
    : correctWords.split(" ");
  const incorrectWordsArray = !incorrectWords
    ? null
    : Array.isArray(incorrectWords)
    ? incorrectWords
    : incorrectWords.split(" ");

  useEffect(() => {
    if (!correctWordsArray || !incorrectWordsArray) return;
    setWordOptions(
      [...correctWordsArray, ...incorrectWordsArray].sort(
        () => Math.random() - 0.5
      )
    );
    setWords([...correctWordsArray, ...incorrectWordsArray]);
    setEmptySlots(correctWordsArray.length);
  }, [correctWords, incorrectWords]); // Dependency array listens to changes

  useEffect(() => {
    if (!correctWordsArray) return;
    if (selectedWords.length === correctWordsArray.length) {
      checkCorrectness();
    }
  }, [selectedWords.length, correctWordsArray?.length]);

  useEffect(() => {
    setSelectedWords([]);
    setIsCorrect(false);
  }, [correctWords, incorrectWords]);

  const handleOptionClick = (word: string) => {
    if (!correctWordsArray) return;
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
    <div className="flex flex-col items-center justify-center">
      {loading && (
        <div className="flex flex-col justify-center items-center mt-2">
          <Loader2 className="w-4 h-4 animate-spin m-1" />
          <WordSelectorPreview />
        </div>
      )}
      {!loading && (
        <div className="flex flex-col items-center justify-center mt-2">
          <div className="flex  items-center justify-center w-96">
            {correctWordsArray &&
              selectedWords.map((word, index) => (
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
          <div className="flex items-center justify-center w-96 grid grid-cols-12 gap-2">
            {wordOptions.map((wordoption: string, index: number) => (
              <div key={index} className="w-full col-span-3 ">
                <Button
                  variant="ghost"
                  className="rounded-md border bg-slate-50 text-center w-full mx-1"
                  onClick={() => handleOptionClick(wordoption)}
                >
                  {wordoption}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
