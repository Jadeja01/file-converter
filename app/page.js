import Link from "next/link";
import { pdfTools} from "./(components)/convert/listofconv";

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

        {/* How it works */}
        <section className="w-full max-w-2xl mx-auto mt-16 text-center">
          <h2 className="text-xl font-bold text-[#471396] mb-4">
            How It Works
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">📤</span>
              <span className="font-semibold text-[#471396]">
                1. Upload PDF
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">⚙️</span>
              <span className="font-semibold text-[#471396]">
                2. Choose Tool
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">⬇️</span>
              <span className="font-semibold text-[#471396]">
                3. Download Result
              </span>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section
          id="plans"
          className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-3xl w-full mt-8"
        >
          <h2 className="text-2xl font-bold text-[#471396] mb-6 text-center">
            Our Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 shadow text-center bg-gradient-to-b from-[#FCECDD] to-[#D6C1F5] h-56 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#471396] mb-2">Free</h3>
                <p className="text-gray-700 mb-2">Unlimited conversions</p>
                <p className="text-gray-700 mb-2">Basic support</p>
              </div>
              <div>
                <p className="font-semibold text-[#7F53AC] text-lg">₹0/month</p>
                <button className="mt-2 bg-[#471396] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#7F53AC] transition-all">
                  Get Started
                </button>
              </div>
            </div>
            <div className="border rounded-lg p-6 shadow text-center bg-gradient-to-b from-[#D6C1F5] to-[#FCECDD] h-56 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#471396] mb-2">Pro</h3>
                <p className="text-gray-700 mb-2">Priority conversion speed</p>
                <p className="text-gray-700 mb-2">Email support</p>
              </div>
              <div>
                <p className="font-semibold text-[#7F53AC] text-lg">
                  ₹299/month
                </p>
                <button className="mt-2 bg-[#471396] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#7F53AC] transition-all">
                  Upgrade
                </button>
              </div>
            </div>
            <div className="border rounded-lg p-6 shadow text-center bg-gradient-to-b from-[#FCECDD] to-[#D6C1F5] h-56 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#471396] mb-2">
                  Enterprise
                </h3>
                <p className="text-gray-700 mb-2">Bulk & API access</p>
                <p className="text-gray-700 mb-2">Dedicated support</p>
              </div>
              <div>
                <p className="font-semibold text-[#7F53AC] text-lg">
                  Contact Us
                </p>
                <button className="mt-2 bg-[#471396] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#7F53AC] transition-all">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
