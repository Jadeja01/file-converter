"use client";
import { useState } from "react";

export default function OperationPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Form data submitted:", formData);
    const files = formData.getAll("file");
    const fields = formData.getAll("watermark_text");
    console.log("fields", fields);

    console.log("Files", files);

    if (
      !files ||
      files.length === 0 ||
      !files[0] ||
      !files[0].name ||
      files[0].size === 0
    ) {
      setError("Please select a file to upload.");
      return;
    }
    if (!fields || fields.length === 0 || !fields[0]) {
      setError("Please enter text for the watermark.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    console.log("Submited data:", formData);

    const response = await fetch("/api/watermark-pdf", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      if (data.success) {
        setLoading(false);
        setResult(data.url);
      } else {
        setError(data.message);
        console.error("Error:", data.message);
        setLoading(false);
      }
    } else {
      setError(data.message || "An error occurred while processing the file.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">
          Add watermark
        </h1>
        <p className="mb-6 text-gray-700 text-center">
          Add a custom watermark (text or image) to your PDF for branding or
          copyright protection.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <label className="w-full">
            <input
              type="file"
              name="file"
              accept=".pdf"
              multiple
              className="block w-full text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#471396] focus:border-[#471396] p-3 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#471396] file:text-white hover:file:bg-[#7F53AC] cursor-pointer"
            />
          </label>
          <input
            type="text"
            name="watermark_text"
            placeholder="Enter text (e.g. 'FriendlyPDF')"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
          >
            {loading ? "Proccessing..." : "Add Watermark"}
          </button>
        </form>

        {/* Show download link/result here */}
        {result && (
          <div className="mt-6 text-center">
            <a href={result} download className="text-blue-600 hover:underline">
              Download Result
            </a>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-center">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
