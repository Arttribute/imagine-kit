import { getPDFText } from "@/utils/fileProcessing";
export async function callGPTApi(
  instruction: string,
  inputs: string,
  externalContext: string,
  outputs: string,
  memory: string,
  knowledgeBase?: string
) {
  try {
    let image = null;
    let fileBase64 = null;

    // Separate text, image, and file (base64) inputs from the inputs string
    const inputArray = inputs.split(" ");
    let textInputs = inputArray
      .filter((input) => {
        if (
          input.startsWith("data:image") ||
          input.startsWith("http://") ||
          input.startsWith("https://")
        ) {
          image = input; // This is the image input (base64 or URL)
          return false; // Exclude image from text inputs
        } else if (input.startsWith("data:application")) {
          fileBase64 = input; // This is the file input (base64)
          return false; // Exclude file from text inputs
        }
        return true; // Keep non-image, non-file inputs as text
      })
      .join(" "); // Combine the text inputs back

    // If a base64 file is detected, process it
    if (fileBase64) {
      const fileInfo = await fetch("/api/filesearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64File: fileBase64 }),
      }).then((res) => res.json());

      // Append extracted file info to text inputs
      textInputs += ` ${fileInfo.fileInfo}`;
      console.log("File info extracted:", fileInfo.fileInfo);
    }

    //append knowledgbease to instruction if provided
    if (knowledgeBase) {
      instruction += `Use the following text knowledbase: ${knowledgeBase}`;
    }

    // Create request body object for the GPT route
    const requestBody: any = {
      instruction,
      inputs: textInputs || "What’s in this image?",
      externalContext,
      outputs,
      memory,
    };

    if (image) {
      requestBody.image = image;
    }

    // Call the original GPT API route
    const response = await fetch("/api/llm/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error in GPT API: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling GPT API:", error);
    throw error;
  }
}
