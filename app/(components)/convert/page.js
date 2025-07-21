"use client";
import Link from "next/link";
import { useState } from "react";

const pdfFormats = [
  { label: "PDF", value: "pdf" },
  { label: "Word (DOCX)", value: "docx" },
  { label: "JPG", value: "jpg" },
  { label: "PNG", value: "png" },
  { label: "Text (TXT)", value: "txt" },
];

const pdfConversions = [
  { from: "pdf", to: "docx", desc: "Convert PDF to editable Word document." },
  { from: "pdf", to: "jpg", desc: "Convert PDF pages to JPG images." },
  { from: "pdf", to: "png", desc: "Convert PDF pages to PNG images." },
  { from: "pdf", to: "txt", desc: "Extract text from PDF." },
  { from: "docx", to: "pdf", desc: "Convert Word document to PDF." },
  { from: "jpg", to: "pdf", desc: "Convert JPG image to PDF." },
  { from: "png", to: "pdf", desc: "Convert PNG image to PDF." },
  { from: "txt", to: "pdf", desc: "Convert text file to PDF." },
];

export default function ConvertPage() {
  const [fromType, setFromType] = useState(pdfFormats[0].value);
  const [toType, setToType] = useState(pdfFormats[1].value);

  const selectedConversion = pdfConversions.find(
    (c) => c.from === fromType && c.to === toType
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-indigo-800">
          PDF Converter
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center mb-6">
          <div className="flex flex-col items-center w-full">
            <label className="font-semibold text-indigo-700 mb-2">
              Convert from
            </label>
            <select
              className="rounded px-4 py-3 border border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-lg w-full"
              value={fromType}
              onChange={(e) => setFromType(e.target.value)}
            >
              {pdfFormats.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <span className="font-bold text-indigo-700 text-xl">→</span>
          <div className="flex flex-col items-center w-full">
            <label className="font-semibold text-indigo-700 mb-2">
              Convert to
            </label>
            <select
              className="rounded px-4 py-3 border border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-lg w-full"
              value={toType}
              onChange={(e) => setToType(e.target.value)}
            >
              {pdfFormats.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-6 text-center text-gray-700 min-h-[24px]">
          {selectedConversion
            ? selectedConversion.desc
            : "This conversion is not available."}
        </div>
        <Link
          href={
            fromType && toType && selectedConversion
              ? `/${fromType}-to-${toType}`
              : "#"
          }
          className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 transition-all ${
            fromType === toType || !selectedConversion
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Go
        </Link>
      </div>
      <div className="mt-12 text-center max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Popular PDF Conversions
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfConversions.slice(0, 6).map((c, idx) => (
            <li
              key={idx}
              className="bg-white bg-opacity-80 rounded-lg shadow p-4"
            >
              <span className="font-semibold text-indigo-700">
                {pdfFormats.find((f) => f.value === c.from)?.label} →{" "}
                {pdfFormats.find((f) => f.value === c.to)?.label}
              </span>
              <div className="text-gray-700 text-sm mt-1">{c.desc}</div>
              <Link
                href={`/${c.from}-to-${c.to}`}
                className="inline-block mt-2 text-indigo-600 font-semibold hover:underline"
              >
                Try Now
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
