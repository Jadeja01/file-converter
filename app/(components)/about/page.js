export default function AboutPage() {
  return (
    <main
      style={{ background: "linear-gradient(135deg, #FCECDD 0%, #D6C1F5 100%)" }}
      className="flex flex-col justify-center items-center font-sans min-h-screen p-6 sm:p-16 gap-10"
    >
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 sm:p-12 max-w-xl w-full text-center">
        <h1 className="font-extrabold text-3xl sm:text-4xl mb-4 text-[#471396] drop-shadow">About File Formater</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">Learn more about our mission and the team behind File Formater.</p>
        <div className="text-base sm:text-lg text-gray-800 mb-8">
          This page is under construction. Please check back later for more information about our project, our values, and how we aim to make file conversion easy for everyone!
        </div>
      </div>
    </main>
  );
}