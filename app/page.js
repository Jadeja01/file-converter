import Link from "next/link";
import { pdfTools } from "./(components)/convert/listofconv";

export default function Home() {

  return (
    <>
      <main
        style={{
          background: "linear-gradient(135deg, #FCECDD 0%, #D6C1F5 100%)",
        }}
        className="flex flex-col justify-center items-center font-sans min-h-screen pt-24 p-6 sm:p-16 gap-10"
      >
        {/* PDF Tools Section */}
        <section className="w-full max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-[#471396] mb-6 text-center">
            PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pdfTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.link}
                className="flex flex-col items-center justify-center p-6 border rounded-lg shadow hover:scale-105 transition-all bg-white h-56"
              >
                <span className="text-4xl mb-2">{tool.icon}</span>
                <h3 className="font-bold text-lg text-[#471396] mb-1 text-center">
                  {tool.name}
                </h3>
                <p className="text-gray-700 text-center text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>


      </main>
    </>
  );
}
