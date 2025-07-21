"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { operatiosns } from "../(components)/convert/listofconv";

export default function OperationPage() {
  const { operation } = useParams();
  const op = operatiosns.find((o) => o.href === "/"+operation);

  if (!op) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="text-2xl font-bold text-red-600">Operation not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">{op.value}</h1>
        <p className="mb-6 text-gray-700 text-center">{op.description}</p>
        <form method="POST" className="flex flex-col items-center gap-6">
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
            className="bg-gradient-to-r from-[#471396] to-[#7F53AC] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:scale-105 hover:from-[#7F53AC] hover:to-[#471396] transition-all focus:outline-none focus:ring-2 focus:ring-[#471396] focus:ring-opacity-50 cursor-pointer"
          >
            {op.value}
          </button>
        </form>
        {/* Show download link/result here */}
      </div>
    </main>
  );
}
