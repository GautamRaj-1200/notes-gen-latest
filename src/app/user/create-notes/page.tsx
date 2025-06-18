"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";

export default function CreateNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notesMarkdown, setNotesMarkdown] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
    setNotesMarkdown(null);
    setIsEditing(false);
    // Validation logic...
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      setFile(null);
    } else if (selectedFile && selectedFile.size > maxSize) {
      setError("File is too large. Maximum size is 20MB.");
      setFile(null);
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get pre-signed URL
      const presignedRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presignedRes.ok) throw new Error("Failed to get pre-signed URL.");
      const { url, key } = await presignedRes.json();

      // 2. Upload to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload to S3.");

      setIsLoading(false);
      setIsGenerating(true);

      // 3. Generate notes
      const generateRes = await fetch("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key }),
      });
      if (!generateRes.ok) {
        const err = await generateRes.json();
        throw new Error(err.error || "Failed to generate notes.");
      }
      const data = await generateRes.json();
      setNotesMarkdown(data.notes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const downloadNotesAsPDF = () => {
    if (!notesMarkdown) return;
    const doc = new jsPDF();
    // jsPDF doesn't directly render markdown styling, so we add the raw text.
    // For styled PDFs, a more complex setup with html-to-canvas would be needed.
    const text = notesMarkdown;
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save("generated-notes.pdf");
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-6 shadow-lg">
          {/* File Upload UI */}
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              Upload a Document to Generate Notes
            </h2>
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-600 p-8 transition-colors hover:border-blue-500 hover:bg-gray-700"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files?.[0] ?? null);
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
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            </div>
          </div>
          {/* End File Upload UI */}

          {file && !error && (
            <div className="mt-6">
              <button
                onClick={handleUploadAndGenerate}
                disabled={isLoading || isGenerating || !!notesMarkdown}
                className="w-full cursor-pointer rounded-lg bg-purple-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading
                  ? "Uploading..."
                  : isGenerating
                    ? "Generating..."
                    : "✨ Upload & Generate Notes"}
              </button>
            </div>
          )}
        </div>

        {notesMarkdown && (
          <div className="mt-8 rounded-lg bg-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Generated Notes</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-500"
                >
                  {isEditing ? "View Notes" : "Edit Notes"}
                </button>
                <button
                  onClick={downloadNotesAsPDF}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                >
                  Download as PDF
                </button>
              </div>
            </div>

            <div className="mt-4">
              {isEditing ? (
                <textarea
                  value={notesMarkdown}
                  onChange={(e) => setNotesMarkdown(e.target.value)}
                  className="h-96 w-full rounded-md bg-gray-900 p-4 font-mono text-gray-200"
                />
              ) : (
                <div className="prose prose-invert max-w-none rounded-md bg-gray-900 p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {notesMarkdown}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
