export async function callGPTApi(
  instruction: string,
  inputs: string,
  outputs: string
) {
  try {
    const response = await fetch("/api/llm/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instruction,
        inputs,
        outputs,
      }),
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
