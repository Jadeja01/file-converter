export default function FooterPage() {
  return (
    <footer className="w-full bg-[#471396] text-white py-6 sm:py-8 lg:py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-2 sm:mb-3 font-bold text-base sm:text-lg lg:text-xl">
            FriendlyPDF
          </div>
          <div className="text-xs sm:text-sm lg:text-base leading-relaxed px-2">
            © {new Date().getFullYear()} All rights reserved. | Made with ❤️ for easy PDF operations.
          </div>
        </div>
      </div>
    </footer>
  );
}