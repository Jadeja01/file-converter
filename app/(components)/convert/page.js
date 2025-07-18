import Link from "next/link";

export default function ConvertPage() {
  return (
    <main
      style={{ background: "linear-gradient(135deg, #FCECDD 0%, #D6C1F5 100%)" }}
      className="flex flex-col justify-center items-center font-sans min-h-screen p-6 sm:p-16 gap-10"
    >
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 sm:p-12 max-w-xl w-full text-center">
        <h1 className="font-extrabold text-3xl sm:text-4xl mb-4 text-[#471396] drop-shadow">Convert Your Files</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">Easily convert your files to different formats in just a few clicks.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {/* Card 1: DOCX to PDF */}
          <div className="bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] rounded-lg shadow-md p-6 flex flex-col items-center">
            <h2 className="font-bold text-xl mb-2 text-[#471396]">DOCX to PDF</h2>
            <p className="text-gray-700 mb-4">Convert your Word documents to PDF format easily.</p>
            <Link href="/convert/docx-to-pdf" className="bg-[#471396] text-white px-4 py-2 rounded hover:bg-[#7F53AC] transition-colors cursor-pointer">Try Now</Link>
          </div>
          {/* Card 2: PDF to DOCX */}
          <div className="bg-gradient-to-br from-[#fbc2eb] to-[#a6c1ee] rounded-lg shadow-md p-6 flex flex-col items-center">
            <h2 className="font-bold text-xl mb-2 text-[#471396]">PDF to DOCX</h2>
            <p className="text-gray-700 mb-4">Convert your PDF files back to editable Word documents.</p>
            <Link href="/convert/pdf-to-docx" className="bg-[#471396] text-white px-4 py-2 rounded hover:bg-[#7F53AC] transition-colors cursor-pointer" >Try Now</Link>
          </div>
        </div>
      </div>
    </main>
  );
}