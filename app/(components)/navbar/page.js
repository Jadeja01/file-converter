"use client";
import Link from "next/link";
import { useState } from "react";
import { allPdfTools, convertPdfOptions } from "../convert/listofconv";

export default function NavbarPage() {
  const [hovered, setHovered] = useState("");

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-white bg-opacity-90 shadow-md sticky top-0 z-50 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-[#471396]">
          🗂️ FriendlyPDF
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden sm:flex gap-8 text-[#471396] font-semibold relative">
        <Link href="/" className="hover:text-[#7F53AC]">HOME</Link>
        <Link href="/compress-pdf" className="hover:text-[#7F53AC]">COMPRESS PDF</Link>
        <Link href="/edit-pdf" className="hover:text-[#7F53AC]">EDIT PDF</Link>
        <Link href="/merge-pdf" className="hover:text-[#7F53AC]">MERGE PDF</Link>
        <Link href="/split-pdf" className="hover:text-[#7F53AC]">SPLIT PDF</Link>

        {/* Convert PDF Dropdown */}
        <div
          onMouseEnter={() => setHovered("convert")}
          onMouseLeave={() => setHovered("")}
          className="relative"
        >
          <span className="hover:text-[#7F53AC] cursor-pointer">CONVERT PDF<i className="ml-1 fa-solid fa-caret-down"></i></span>
          {hovered === "convert" && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg p-4 z-50 w-[340px]">
              <div className="font-bold text-[#471396] mb-2">Conversion Options</div>
              <div className="grid grid-cols-2 gap-2">
                {convertPdfOptions.map((ops, idx) => (
                  <Link
                    key={idx}
                    href={`${ops.href}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff] rounded-md"
                  >
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Tools Dropdown */}
        <div
          onMouseEnter={() => setHovered("allPdfTools")}
          onMouseLeave={() => setHovered("")}
          className="relative"
        >
          <span className="hover:text-[#7F53AC] cursor-pointer">ALL PDF TOOLS<i className="ml-1 fa-solid fa-caret-down"></i></span>
          {hovered === "allPdfTools" && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg p-4 z-50 w-[360px]">
              <div className="font-bold text-[#471396] mb-2">All PDF Tools</div>
              <div className="grid grid-cols-2 gap-2">
                {allPdfTools.map((ops, idx) => (
                  <Link
                    key={idx}
                    href={`${ops.href}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff] rounded-md"
                  >
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* CTA Button */}
      <Link
        href="/convert"
        className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all"
      >
        Try Now
      </Link>
    </header>
  );
}
