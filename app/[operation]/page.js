"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { operatiosns } from "../(components)/convert/listofconv";
import Link from "next/link";

export default function OperationPage({params}) {
  const { operation } = params;
  console.log("Operation:", operation);
  const op = operatiosns.find((op) => op.href === "/" + operation);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  if (!op) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="text-2xl font-bold text-red-600">
          Operation not found
        </div>
      </main>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    console.log("Submited data:", formData);
    console.log('Operation href:', op.href);
    
    const response = await fetch(`/api${op.href}`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setLoading(false);
        setResult(data.url);
        // alert(`File processed successfully! Download it from: ${data.url}`);
      } else {
        setError(data.message);
        console.error("Error:", data.message);
        setLoading(false);
      }
    } else {
      setError("An error occurred while processing the file.");
      setLoading(false);
    }
    setLoading(false);

  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">{op.value}</h1>
        <p className="mb-6 text-gray-700 text-center">{op.description}</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <label className="w-full">
            <input
              type="file"
              name="file"
              accept=".pdf"
              multiple
              className="block w-full text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#471396] focus:border-[#471396] p-3 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#471396] file:text-white hover:file:bg-[#7F53AC] cursor-pointer"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
          >
            {loading ? "Proccessing..." : op.value}
          </button>
        </form>
        {/* Show download link/result here */}
        {result && (
          <div className="mt-6 text-center">
            <Link href={result} className="text-blue-600 hover:underline">
              Download Result
            </Link>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-center">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
