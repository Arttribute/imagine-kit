import { Inter } from "next/font/google";
import "./globals.css";
import { Chakra_Petch, Space_Grotesk } from "next/font/google";
import React from "react";
import SessionProvider from "@/providers/SessionProvider";
import { getServerSession } from "next-auth";
import "reactflow/dist/style.css";
import { Analytics } from "@vercel/analytics/react";

const space_grotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={space_grotesk.className}>
        <SessionProvider session={session}>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
