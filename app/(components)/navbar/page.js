"use client";
import Link from "next/link";
import { useState } from "react";
import { allPdfTools, convertPdfOptions } from "../convert/listofconv";
import Image from "next/image";

export default function NavbarPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full flex justify-between items-center px-4 sm:px-6 py-3 bg-white shadow-md top-0 z-40 relative">
        {/* Left: Hamburger on mobile + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Icon */}
          <button
            className="cursor-pointer 2xl:hidden text-[#471396] text-xl p-2 hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center justify-center border border-[#471396]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6 flex flex-col justify-center">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#471396]">
              🗂️ FriendlyPDF
            </span>
          </Link>
        </div>

        {/* Center: Nav items for desktop */}
        <nav className="hidden sm:flex gap-2 lg:gap-4 xl:gap-6 text-[#471396] font-semibold text-xs md:text-sm xl:text-base items-center">
          <Link href="/compress-pdf" className="hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">COMPRESS</Link>
          <Link href="/edit-pdf" className="hidden md:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">EDIT</Link>
          <Link href="/merge-pdf" className="hidden lg:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">MERGE</Link>
          <Link href="/split-pdf" className="hidden lg:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">SPLIT</Link>
          <Link href="/watermark-pdf" className="hidden lg:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">WATERMARK</Link>

          {/* Convert PDF Dropdown */}
          <div className="cursor-pointer relative group hidden xl:block">
            <button className="cursor-pointer hover:text-[#7F53AC] transition duration-200 px-2 py-1 flex items-center">
              CONVERT PDF
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-xl p-4 z-50 w-[340px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="font-bold text-[#471396] mb-3">Conversion Options</div>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {convertPdfOptions.map((ops, idx) => (
                  <Link key={idx} href={ops.href} className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#471396] rounded-md transition">
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* All Tools Dropdown */}
          <div className="cursor-pointer relative group hidden 2xl:block">
            <button className="cursor-pointer hover:text-[#7F53AC] transition duration-200 px-2 py-1 flex items-center">
              ALL PDF TOOLS
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-xl p-4 z-50 w-[360px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="font-bold text-[#471396] mb-3">All PDF Tools</div>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {allPdfTools.map((ops, idx) => (
                  <Link key={idx} href={ops.href} className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#471396] rounded-md transition">
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Buy Me a Coffee */}
          <div className="hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            <a href={process.env.NEXT_PUBLIC_BUY_ME_COFFEE}  target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                width={140}
                height={40}
              />
            </a>
          </div>

        </nav>



        {/* Right: Try Now Button */}
        <Link
          href="/convert"
          className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all text-xs sm:text-sm md:text-base"
        >
          Try Now
        </Link>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[9999] 2xl:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 10000 }}>
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <span className="text-lg font-bold text-[#471396]">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#471396] p-2 cursor-pointer hover:bg-white hover:shadow-md rounded-lg transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="h-full overflow-y-auto pb-20 p-4 space-y-6">
            {/* Quick Tools */}
            <div>
              <h3 className="font-bold text-[#471396] mb-3">Quick Tools</h3>
              {[
                { href: "/compress-pdf", label: "Compress PDF", icon: "📦" },
                { href: "/edit-pdf", label: "Edit PDF", icon: "✏️" },
                { href: "/merge-pdf", label: "Merge PDF", icon: "🔗" },
                { href: "/split-pdf", label: "Split PDF", icon: "✂️" },
                { href: "/watermark-pdf", label: "Watermark PDF", icon: "🏷️" },
              ].map((link, idx) => (
                <Link key={idx} href={link.href} className="flex items-center text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2.5 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="mr-3">{link.icon}</span> {link.label}
                </Link>
              ))}
            </div>

            {/* Convert PDF */}
            <div> 
              <h3 className="font-bold text-[#471396] mb-3">Convert PDF</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {convertPdfOptions.map((opt, idx) => (
                  <Link key={idx} href={opt.href} className="block text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>
                    {opt.value}
                  </Link>
                ))}
              </div>
            </div>

            {/* All Tools */}
            <div>
              <h3 className="font-bold text-[#471396] mb-3">All Tools</h3>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {allPdfTools.map((opt, idx) => (
                  <Link key={idx} href={opt.href} className="block text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>
                    {opt.value}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Buy Me a Coffee */}
            <div className="hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            <a href={process.env.NEXT_PUBLIC_BUY_ME_COFFEE} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                width={140}
                height={40}
              />
            </a>
          </div>

            {/* Try Now */}
            <Link href="/convert" className="block w-full text-center bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition" onClick={() => setIsMobileMenuOpen(false)}>
              🚀 Try Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
