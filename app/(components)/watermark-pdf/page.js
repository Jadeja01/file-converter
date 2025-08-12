"use client";
import { useState } from "react";

export default function WatermarkPDFPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const files = formData.getAll("file");
    const ranges = formData.getAll("watermark_text");

    if (!files?.length || !files[0]?.name || files[0].size === 0) {
      setError("Please select a file to upload.");
      return;
    }
    if (!ranges?.length || !ranges[0]) {
      setError("Please enter text to watermark the PDF.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/watermark-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.json();
        throw new Error(errText.message || "An error occurred while processing the file.");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `watermark-pdf-result.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) filename = match[1];
      }
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Watermark PDF error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 sm:p-10 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-800">
          Add Watermark
        </h1>
        <p className="mb-6 text-sm sm:text-base text-gray-700 text-center">
          Add a custom watermark (text or image) to your PDF for branding or
          copyright protection.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#471396] focus:border-[#471396] text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto text-center bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50"
          >
            {loading ? "Processing..." : "Add Watermark"}
          </button>
        </form>



        {/* Error section */}
        {error && (
          <div className="mt-4 text-red-600 text-center text-sm sm:text-base">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
