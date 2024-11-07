export async function callGPTApi(
  instruction: string,
  inputs: string,
  outputs: string,
  memory: string
) {
  try {
    let image = null;

    // Separate text, and image inputs from the inputs string
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
        }
        return true; // Keep non-image, non-file inputs as text
      })
      .join(" "); // Combine the text inputs back

    // Create request body object for the GPT route
    const requestBody: any = {
      instruction,
      inputs: textInputs || "What’s in this image?",
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
