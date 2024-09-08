// utils/apicalls/dalle.ts
export async function callDalleApi(prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/imagegen/dalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const imageUrl = await response.json();
    return imageUrl; // Assuming the API returns the image URL directly
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
}
