"use client";
import { useState } from "react";
import ChatBox from "@/components/sophia/ChatBox";

export default function Sophia() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDrawer = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDrawer}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Toggle Drawer
      </button>

      <div
        className={`fixed border border-indigo-400  bottom-0 right-4 w-80 max-w-md h-6/7 bg-white shadow-xl shadow-sky-800 rounded-t-xl transform transition-transform z-20 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-gray-600"
        >
          Close
        </button>
        <div className="p-2">
          <h2 className="text-lg font-bold ">Drawer Content</h2>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
