"use client";
import { useState } from "react";

export default function CreateNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleGenerateNotes = () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    // Placeholder for the API call to generate notes
    console.log("Generating notes for:", file.name);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-6 shadow-lg">
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold text-gray-100">
                Upload a Document
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
                  {file && !error && (
                    <p className="text-green-400">Selected: {file.name}</p>
                  )}
                  {!file && !error && (
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
                    onClick={handleGenerateNotes}
                    className="w-full cursor-pointer rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
                  >
                    Generate Notes
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
