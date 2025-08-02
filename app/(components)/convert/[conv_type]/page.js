"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { operatiosns } from "../listofconv";
import Image from "next/image";

export default function ConversionPage() {
  const { conv_type } = useParams();
  const op = operatiosns.find((op) => op.href === "/convert/" + conv_type);
  const [from, to] = conv_type.split("-to-");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const acceptedFileTypes = () => {
    switch (from) {
      case "pdf": return ".pdf";
      case "jpg": return ".jpg";
      case "png": return ".png";
      case "txt": return ".txt";
      case "docx": return ".docx";
      default: return "*/*";
    }
  };

  if (!op) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
        <div className="text-2xl font-bold text-red-600 text-center">Operation not found</div>
      </main>
    );
  }

  if (
    conv_type === "pdf-to-docx" || conv_type === "docx-to-pdf" ||
    conv_type === "pdf-to-txt" || conv_type === "txt-to-pdf" ||
    conv_type === "pdf-to-jpg" || conv_type === "pdf-to-png" ||
    conv_type === "jpg-to-pdf" || conv_type === "png-to-pdf"
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 capitalize mb-6">
          {conv_type.replace("-to-", " to ").toUpperCase()}, coming soon...
        </h3>
        <Image
          src="/images/coming-soon.png"
          alt="Coming Soon"
          width={384}
          height={384}
        />
        <p className="mt-4 text-gray-500 max-w-md text-base sm:text-lg">
          We&apos;re working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const files = formData.getAll("file");

    if (!files || files.length === 0 || !files[0] || !files[0].name || files[0].size === 0) {
      setError("Please select a file to upload.");
      return;
    }

    if (op.href === "/merge-pdf" && files.length < 2) {
      setError("Please select at least two files to merge.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const response = await fetch(`/api${op.href}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data.success) {
      setLoading(false);
      setResult(data.url);
    } else {
      setError(data.message || "Error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-10 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-indigo-800 text-center">
          {op.value}
        </h1>
        <p className="mb-4 sm:mb-6 text-gray-700 text-center text-sm sm:text-base">
          {op.description}
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4 sm:gap-6">
          <label className="w-full">
            <input
              type="file"
              name="file"
              accept={acceptedFileTypes()}
              multiple
              className="block w-full text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#471396] focus:border-[#471396] p-3 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#471396] file:text-white hover:file:bg-[#7F53AC] cursor-pointer"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
          >
            {loading ? "Processing..." : op.value}
          </button>
        </form>

        {/* Download section */}
        {result && (
          <div className="mt-6 text-center">
            <a href={result} download className="text-blue-600 hover:underline break-all">
              Download Result
            </a>
          </div>
        )}

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
