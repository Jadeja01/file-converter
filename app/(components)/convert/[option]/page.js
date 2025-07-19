"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Option() {
  const { option } = useParams();
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDownloadUrl(null);

    const formData = new FormData(e.target);
    const file = formData.get("file");

    if (!file || file.size === 0) {
      setError("Please select a file.");
      setIsLoading(false);
      return;
    }

    formData.append("conversionType", option);
    console.log("formData(after append)", formData);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setDownloadUrl(data.url);
      } else{
        setError(data.message || "Conversion failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    }
    setIsLoading(false);
  };

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #FCECDD 0%, #D6C1F5 100%)",
      }}
      className="flex flex-col justify-center items-center font-sans min-h-screen p-6 sm:p-16"
    >
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#471396] drop-shadow">
          Convert: {option}
        </h2>
        <form
          onSubmit={handleConvert}
          method="POST"
          className="flex flex-col items-center gap-6"
        >
          <label className="w-full">
            <span className="block text-left text-gray-700 font-semibold mb-2">
              Select file to convert
            </span>
            <input
              type="file"
              name="file"
              //   multiple
              accept=".docx, .pdf"
              className="block w-full text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#471396] focus:border-[#471396] p-3 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#471396] file:text-white hover:file:bg-[#7F53AC] cursor-pointer"
            />
          </label>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
          >
            {isLoading ? "Converting..." : "Convert"}
          </button>
        </form>
        {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}
        {downloadUrl && (
        <Link
          href={downloadUrl}
          download
          className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Converted File
        </Link>
      )}
      </div>
    </main>
  );
}
