// utils/llm.ts
export async function callLLMApi(
  instruction: string,
  inputs: string,
  outputs: string
) {
  try {
    const response = await fetch("/api/llm", {
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
      throw new Error(`Error in LLM API: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling LLM API:", error);
    throw error;
  }
}
