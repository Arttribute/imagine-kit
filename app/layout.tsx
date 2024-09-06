"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Chakra_Petch } from "next/font/google";
import React from "react";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "@/store/store";
import "reactflow/dist/style.css";

const inter = Inter({ subsets: ["latin"] });
const chakra_petch = Chakra_Petch({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <body className={chakra_petch.className}>{children}</body>
        </DndProvider>
      </Provider>
    </html>
  );
}
