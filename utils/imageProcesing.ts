export async function getImageBase64(imageUrl: string) {
  try {
    const response = await fetch(
      `/api/imageproxy/base64?imageUrl=${encodeURIComponent(imageUrl)}`
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Base64 string:", data.base64);
      return data.base64;
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function getImageBlob(imageUrl: string) {
  try {
    // Fetch the binary image data from the Next.js API route
    const response = await fetch(
      `/api/imageproxy/blob?imageUrl=${encodeURIComponent(imageUrl)}`
    );

    if (!response.ok) {
      throw new Error("Error fetching image");
    }

    // Convert the response into a Blob
    const blob = await response.blob();
    console.log("Blob:", blob);

    // You can now use the Blob (e.g., display it as an image)
    return blob;
  } catch (error) {
    console.error("Error:", error);
  }
}

export function base64ToBlob(
  base64: string,
  contentType: string = "",
  sliceSize: number = 512
): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
