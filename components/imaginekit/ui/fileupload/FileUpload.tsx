import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  PaperclipIcon,
  CloudUploadIcon,
  FileIcon,
  Loader2Icon,
} from "lucide-react"; // You can use FileIcon as a placeholder

interface FileUploadProps {
  onUpload: (file: string) => void;
  loading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        // Handle image preview
        setPreviewUrl(URL.createObjectURL(file));
        setFileContent(null);
      } else if (fileType === "application/pdf") {
        // Handle PDF preview
        setPreviewUrl(URL.createObjectURL(file));
        setFileContent(null);
      } else if (fileType.startsWith("text/")) {
        // Handle text file preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setFileContent(event.target?.result as string);
        };
        reader.readAsText(file);
        setPreviewUrl(null);
      } else {
        // For other file types, show file name
        setPreviewUrl(null);
        setFileContent(file.name);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      //convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64data = reader.result as string;
        if (base64data) {
          console.log("Base64 audio:", base64data);
          onUpload(base64data);
        }
      };
    }
  };

  return (
    <div className="flex items-center border p-2 bg-white rounded-xl shadow-lg w-96">
      <input
        type="file"
        name="file"
        id="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700"
        >
          <div className="p-2 rounded-lg">
            <PaperclipIcon className="w-5 h-5 text-indigo-600" />
          </div>
        </label>
      )}
      {!selectedFile && (
        <label htmlFor="file" className="w-full m-1">
          <div className="flex w-full border border-dashed border-gray-500 text-indigo-500 p-1 rounded-lg">
            <div className="flex items-center justify-center border border-gray-900 text-gray-900 px-4 py-1.5 rounded-lg">
              <CloudUploadIcon className="w-5 h-5 mr-1 text-gray-900" />
              <p className="text-xs">Upload file</p>
            </div>
          </div>
        </label>
      )}
      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center border border-gray-500 rounded-xl w-full m-1 p-0.5">
          <div className="h-9 w-9 border border-gray-300 rounded-lg">
            {previewUrl && selectedFile?.type.startsWith("image/") && (
              <img
                src={previewUrl}
                alt="Image Preview"
                className="h-full w-full rounded-lg"
              />
            )}
            {previewUrl && selectedFile?.type === "application/pdf" && (
              <object
                data={previewUrl}
                type="application/pdf"
                className="h-full w-full rounded-lg"
              >
                <p>PDF preview not supported. Download the file instead.</p>
              </object>
            )}
            {fileContent && selectedFile?.type.startsWith("text/") && (
              <div className="w-12 h-12 p-2 border rounded-xl overflow-auto bg-gray-100">
                <pre>{fileContent}</pre>
              </div>
            )}
            {!previewUrl &&
              !selectedFile?.type.startsWith("image/") &&
              !selectedFile?.type.startsWith("application/pdf") && (
                <div className="w-full h-full flex items-center justify-center bg-indigo-500 border rounded-lg">
                  <FileIcon className="w-5 h-5 text-white" />
                </div>
              )}
          </div>
          <div className="flex-grow flex items-center ml-2">
            {selectedFile && (
              <div className="overflow-hidden w-48">
                <p className="text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Upload Button */}
      {selectedFile ? (
        <Button
          className="m-1 p-3 rounded-xl ml-auto"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          {!loading ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          )}
        </Button>
      ) : (
        <Button className="m-1 p-3 rounded-xl ml-auto" disabled={!selectedFile}>
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
