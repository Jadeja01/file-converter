"use client";
import Link from "next/link";
import { useState } from "react";
import { allPdfTools, convertPdfOptions } from "../convert/listofconv";

export default function NavbarPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Debug state
  console.log('Mobile menu state:', isMobileMenuOpen);

  return (
    <>
      <header className="w-full flex justify-between items-center px-4 sm:px-6 py-3 bg-white shadow-md sticky top-0 z-40">
        {/* Left: Hamburger on mobile + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Icon - Shows on mobile (< sm) */}
          <button
            className="2xl:hidden text-[#471396] text-xl p-2 hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center justify-center border border-[#471396]"
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

        {/* Center: Nav items for desktop (hidden on mobile) */}
        <nav className="hidden sm:flex gap-2 lg:gap-4 xl:gap-6 text-[#471396] font-semibold text-xs md:text-sm xl:text-base items-center">
          {/* Always visible on sm+ screens */}
          <Link href="/compress-pdf" className="hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            COMPRESS
          </Link>
          <Link href="/edit-pdf" className="hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            EDIT
          </Link>
          
          {/* Hidden on smaller screens, visible on md+ */}
          <Link href="/merge-pdf" className="hidden md:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            MERGE
          </Link>
          <Link href="/split-pdf" className="hidden md:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            SPLIT
          </Link>
          
          {/* Hidden on smaller screens, visible on lg+ */}
          <Link href="/watermark-pdf" className="hidden lg:block hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded">
            WATERMARK
          </Link>

          {/* Convert PDF Dropdown - visible on xl+ */}
          <div className="relative group hidden xl:block">
            <button className="cursor-pointer hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded flex items-center">
              CONVERT PDF 
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-[340px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="font-bold text-[#471396] mb-3 text-base">Conversion Options</div>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {convertPdfOptions.map((ops, idx) => (
                  <Link
                    key={idx}
                    href={ops.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#471396] rounded-md transition-colors duration-200"
                  >
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* All Tools Dropdown - visible on 2xl+ */}
          <div className="relative group hidden 2xl:block">
            <button className="cursor-pointer hover:text-[#7F53AC] transition-colors duration-200 px-2 py-1 rounded flex items-center">
              ALL PDF TOOLS 
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-[360px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="font-bold text-[#471396] mb-3 text-base">All PDF Tools</div>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {allPdfTools.map((ops, idx) => (
                  <Link
                    key={idx}
                    href={ops.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#471396] rounded-md transition-colors duration-200"
                  >
                    {ops.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right: Try Now Button (always visible) */}
        <Link
          href="/convert"
          className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-xs sm:text-sm md:text-base whitespace-nowrap"
        >
          Try Now
        </Link>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[9999] 2xl:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 10000 }}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
            <span className="text-lg font-bold text-[#471396]">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#471396] p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="h-full overflow-y-auto pb-20">
            <div className="p-4 space-y-6">
              {/* Quick Tools */}
              <div>
                <h3 className="font-bold text-[#471396] text-base mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Quick Tools
                </h3>
                <div className="space-y-1">
                  {[
                    { href: "/compress-pdf", label: "Compress PDF", icon: "📦" },
                    { href: "/edit-pdf", label: "Edit PDF", icon: "✏️" },
                    { href: "/merge-pdf", label: "Merge PDF", icon: "🔗" },
                    { href: "/split-pdf", label: "Split PDF", icon: "✂️" },
                    { href: "/watermark-pdf", label: "Watermark PDF", icon: "🏷️" }
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2.5 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Convert PDF */}
              <div>
                <h3 className="font-bold text-[#471396] text-base mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Convert PDF
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {convertPdfOptions.map((opt, idx) => (
                    <Link
                      key={idx}
                      href={opt.href}
                      className="block text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {opt.value}
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Tools */}
              <div>
                <h3 className="font-bold text-[#471396] text-base mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  All Tools
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {allPdfTools.map((opt, idx) => (
                    <Link
                      key={idx}
                      href={opt.href}
                      className="block text-gray-700 hover:text-[#471396] hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {opt.value}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Try Now Button */}
              <div className="pt-4">
                <Link
                  href="/convert"
                  className="block w-full text-center bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🚀 Try Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





