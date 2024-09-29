export async function callXMTPApi(
  instruction: string,
  inputs: string,
  outputs: string
) {
  try {
    const response = await fetch("/api/xmtp", {
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
      throw new Error(`Error in XMTP API: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling XMTP API:", error);
    throw error;
  }
}
