export async function callWhisperApi(base64Audio: string) {
  const response = await fetch("/api/voice/whisper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64Audio }),
  });

  if (!response.ok) {
    throw new Error(`Error in Whisper API: ${response.statusText}`);
  }

  const result = await response.json();
  return result.transcription;
}
