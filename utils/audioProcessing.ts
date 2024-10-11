export async function audioBlobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); // Convert blob to Base64 encoded string
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
