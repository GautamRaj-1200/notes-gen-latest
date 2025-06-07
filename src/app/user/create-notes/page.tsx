"use client";
import { useState } from "react";

export default function CreateNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [s3Key, setS3Key] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setError(null);
      return;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (selectedFile.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      setFile(null);
      return;
    }
    if (selectedFile.size > maxSize) {
      setError(
        `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`,
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setS3Key(null); // Reset S3 key when a new file is chosen
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get a pre-signed URL from our API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL.");
      }

      const { url, key } = await response.json();

      // 2. Upload the file directly to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3.");
      }

      setS3Key(key);
      console.log("File uploaded successfully. S3 Key:", key);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-6 shadow-lg">
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold text-gray-100">
                Upload a Document to Generate Notes
              </h2>
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-600 p-8 transition-colors hover:border-blue-500 hover:bg-gray-700"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
              >
                <div className="space-y-4">
                  {error && <p className="text-red-500">{error}</p>}
                  {s3Key && (
                    <p className="text-green-400">
                      Upload successful! Ready to generate.
                    </p>
                  )}
                  {file && !s3Key && !error && (
                    <p className="text-green-400">Selected: {file.name}</p>
                  )}
                  {!file && !error && !s3Key && (
                    <>
                      <p className="text-gray-300">Drag and drop a PDF here</p>
                      <p className="text-gray-500">or</p>
                    </>
                  )}
                  <label className="cursor-pointer rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) => {
                        const files = e.target.files;
                        handleFileChange(files?.[0] ?? null);
                      }}
                    />
                  </label>
                </div>
              </div>

              {file && !error && (
                <div className="mt-6">
                  <button
                    onClick={handleUpload}
                    disabled={isLoading || !!s3Key}
                    className="w-full cursor-pointer rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading
                      ? "Uploading..."
                      : s3Key
                        ? "Uploaded"
                        : "Upload PDF"}
                  </button>
                </div>
              )}

              <p className="mt-4 text-sm text-gray-400">
                Supported file: PDF (Max size: 20MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
