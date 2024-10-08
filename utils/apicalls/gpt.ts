export async function callGPTApi(
  instruction: string,
  inputs: string,
  outputs: string,
  memory: string
) {
  try {
    // Separate base64 image strings from other inputs
    const inputArray = inputs.split(" ");
    let image = null;
    let textInputs = inputArray
      .filter((input) => {
        //if istring start with data:image or url then it is image
        if (
          input.startsWith("data:image") ||
          input.startsWith("http://") ||
          input.startsWith("https://")
        ) {
          image = input; // Assume this is the image base64 data
          return false; // Exclude image from text inputs
        }
        return true; // Keep non-image inputs
      })
      .join(" "); // Combine back the text inputs

    // Create request body object
    const requestBody: any = {
      instruction,
      inputs: textInputs || "What’s in this image?",
      outputs,
      memory,
    };

    // Only add image to the request body if it exists
    if (image) {
      requestBody.image = image; // Include the base64 image string
    }

    const response = await fetch("/api/llm/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Dynamically include image if available
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
