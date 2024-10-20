import { NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse"; // Using pdf-parse for PDF extraction
import mammoth from "mammoth"; // For extracting text from DOCX files

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { base64File, fileType } = requestBody;

    if (!base64File) {
      throw new Error("No file provided.");
    }

    let extractedText = "";

    // Determine file type and extract text accordingly
    if (fileType === "application/pdf") {
      extractedText = await extractTextFromPDF(base64File);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractedText = await extractTextFromDOCX(base64File);
    } else if (fileType === "text/plain") {
      extractedText = await extractTextFromTXT(base64File);
    } else {
      extractedText = await extractTextFromPDF(base64File);
    }

    return new NextResponse(JSON.stringify({ fileInfo: extractedText }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error processing file:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// Helper function to extract text from PDFs using pdf-lib
async function extractTextFromPDF(base64File: string): Promise<string> {
  const fileContent = Buffer.from(base64File.split(",")[1], "base64");
  const data = await pdf(fileContent);
  const extractedText = data.text;

  return extractedText;
}

// Helper function to extract text from DOCX using mammoth
async function extractTextFromDOCX(base64File: string): Promise<string> {
  const fileContent = Buffer.from(base64File.split(",")[1], "base64");
  const result = await mammoth.extractRawText({ buffer: fileContent });
  return result.value; // Extracted text from DOCX
}

// Helper function to extract text from TXT files
async function extractTextFromTXT(base64File: string): Promise<string> {
  const fileContent = Buffer.from(base64File.split(",")[1], "base64");
  return fileContent.toString("utf-8"); // Extract text from plain text file
}
