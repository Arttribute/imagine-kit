export async function getPDFText(fileBase64: string) {
  try {
    const fileInfo = await fetch("/api/filesearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64File: fileBase64 }),
    }).then((res) => res.json());
    console.log("File info extracted:", fileInfo.fileInfo);
    return fileInfo.fileInfo;
  } catch (error) {
    console.error("Error:", error);
  }
}
