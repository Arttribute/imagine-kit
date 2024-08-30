"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import React from "react";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "@/store/store";
import "reactflow/dist/style.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <body className={inter.className}>{children}</body>
        </DndProvider>
      </Provider>
    </html>
  );
}
