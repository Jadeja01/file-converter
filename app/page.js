"use client"
export default function Home() {
  return (
    <>
      <main
        style={{ background: "linear-gradient(135deg, #FCECDD 0%, #D6C1F5 100%)" }}
        className="flex flex-col justify-center items-center font-sans min-h-screen p-6 sm:p-16 gap-10"
      >
        <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 sm:p-12 max-w-xl w-full text-center">
          <h1 className="font-extrabold text-3xl sm:text-4xl mb-4 text-[#471396] drop-shadow">Welcome to File Formater</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">Your go-to solution for converting file types easily and efficiently.</p>
          <ul className="text-left text-base sm:text-lg text-gray-800 mb-8 list-disc list-inside mx-auto max-w-xs">
            <li>Convert between popular file formats</li>
            <li>Fast, secure, and user-friendly</li>
            <li>No sign-up required</li>
            <li>100% free to use</li>
          </ul>
          <button
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
            onClick={() => window.location.href = "/convert"}
          >
            Try Now
          </button>
        </div>
      </main>
    </>
  );
}
