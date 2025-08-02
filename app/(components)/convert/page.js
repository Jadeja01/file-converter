"use client";
import Link from "next/link";
import { useState } from "react";
import { pdfConversions, pdfFormats } from "./listofconv";

export default function ConvertPage() {
  const [fromType, setFromType] = useState(pdfFormats[0].value);
  const [toType, setToType] = useState(pdfFormats[1].value);

  const selectedConversion = pdfConversions.find(
    (c) => c.from === fromType && c.to === toType
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-10 bg-gradient-to-br from-purple-100 to-indigo-100">
      {/* Converter Card */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 sm:p-10 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-indigo-800">
          PDF Converter
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center items-center mb-6">
          {/* Convert from */}
          <div className="flex flex-col items-center w-full">
            <label className="font-semibold text-indigo-700 mb-2 text-sm sm:text-base">
              Convert from
            </label>
            <select
              className="cursor-pointer rounded px-4 py-3 border border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-base sm:text-lg w-full"
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

          {/* Arrow */}
          <span className="font-bold text-indigo-700 text-xl hidden sm:block">
            →
          </span>

          {/* Convert to */}
          <div className="flex flex-col items-center w-full">
            <label className="font-semibold text-indigo-700 mb-2 text-sm sm:text-base">
              Convert to
            </label>
            <select
              className="cursor-pointer rounded px-4 py-3 border border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-base sm:text-lg w-full"
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

        {/* Description */}
        <div className="mb-6 text-center text-gray-700 text-sm sm:text-base min-h-[24px]">
          {selectedConversion
            ? selectedConversion.desc
            : "This conversion is not available."}
        </div>

        {/* Go Button */}
        <Link
          href={
            fromType && toType && selectedConversion
              ? `/convert/${fromType}-to-${toType}`
              : "#"
          }
          className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:scale-105 transition-all ${
            fromType === toType || !selectedConversion
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Go
        </Link>
      </div>

      {/* Popular Conversions Section */}
      <div className="mt-12 text-center max-w-xl mx-auto px-4">
        <h2 className="text-lg sm:text-xl font-bold text-indigo-700 mb-4">
          Popular PDF Conversions
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfConversions.slice(0, 6).map((c, idx) => (
            <li
              key={idx}
              className="bg-white bg-opacity-80 rounded-lg shadow p-4"
            >
              <span className="font-semibold text-indigo-700 block">
                {pdfFormats.find((f) => f.value === c.from)?.label} →{" "}
                {pdfFormats.find((f) => f.value === c.to)?.label}
              </span>
              <div className="text-gray-700 text-sm mt-1">{c.desc}</div>
              <Link
                href={`/convert/${c.from}-to-${c.to}`}
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
