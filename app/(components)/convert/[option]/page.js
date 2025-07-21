"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { listOfConversions,listOfFormats,acceptedFormats,services } from "../listofconv";



export default function Option() {
  const { option } = useParams();
  const [from,to] = option.split("-to-");
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();
  const router = useRouter();
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function getAcceptedOptions(option) {
    const ops = option.split("-to-")[0];
    return acceptedFormats[ops] || "*";
  }

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
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setDownloadUrl(data.urls);
      } else {
        setError(data.message || "Conversion failed. Please try again.");
      }
    } catch (error) {
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
      {/* Conversion Card */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center mb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-[#471396] font-semibold px-4 py-2 rounded hover:bg-[#f3e8ff] transition-all"
        >
          ← Back
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#471396] drop-shadow">
          Convert: {FROM}-to-{TO}
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
              multiple
              accept={getAcceptedOptions(option)}
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
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {downloadUrl &&
          downloadUrl.map((file, idx) => {
            return (
              <div key={idx} className="mt-4">
                <p className="text-gray-800">
                  {(() => {
                    const base = file.name.replace(/\.[^/.]+$/, "");
                    const shortBase =
                      base.length > 20 ? base.slice(0, 20) + "..." : base;
                    return `${shortBase}.${option.split("-to-")[1]}`;
                  })()}
                </p>
                <Link
                  href={file.url}
                  download
                  className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download Converted File
                </Link>
              </div>
            );
          })}
      </div>
      {/* Other Services Section */}
      <section className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 sm:p-12 max-w-2xl w-full text-center flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold text-[#471396] mb-6">Other Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.link}
              className="flex items-center gap-3 p-6 border rounded-lg shadow bg-white hover:bg-[#f3e8ff] transition-all w-full justify-center"
            >
              <span className="text-3xl">{service.icon}</span>
              <span className="font-semibold text-[#471396] text-lg">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
