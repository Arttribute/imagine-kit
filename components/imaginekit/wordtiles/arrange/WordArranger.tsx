"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function WordArranger({
  correctWords,
  setIsCorrect,
}: {
  correctWords: string[];
  setIsCorrect: (isCorrect: boolean) => void;
}) {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle the words initially
    const shuffled = [...correctWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [correctWords]);

  useEffect(() => {
    if (shuffledWords.join(" ") === correctWords.join(" ")) {
      //setIsCorrect(true);
    } else {
      //setIsCorrect(false);
    }
  }, [shuffledWords, correctWords]);

  const handleReorder = (newOrder: string[]) => {
    setShuffledWords(newOrder);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = shuffledWords.indexOf(active.id.toString());
          const newIndex = shuffledWords.indexOf(over?.id?.toString() || "");

          handleReorder(arrayMove(shuffledWords, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext
        items={shuffledWords}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-wrap">
          {shuffledWords.map((word, index) => (
            <SortableWord key={word} id={word} word={word} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableWord({ id, word }: { id: string; word: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Button
      variant="ghost"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="m-1 rounded-md border px-2 py-1 bg-slate-50"
    >
      <p className="font-medium">{word}</p>
    </Button>
  );
}
