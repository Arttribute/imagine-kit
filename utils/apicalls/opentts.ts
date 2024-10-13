import { audioBlobToBase64 } from "../audioProcessing";
export async function callTTSApi(textInput: string) {
  const response = await fetch("/api/voice/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: textInput }),
  });

  if (!response.ok) {
    console.error("Error:", response.statusText);
  }

  const blob = await response.blob();
  const audioString = await audioBlobToBase64(blob);
  return audioString;
}
