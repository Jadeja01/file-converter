export default function FooterPage() {
    return (
      <footer
        className="bg-white bg-opacity-80 rounded-xl shadow-md text-gray-500 text-sm mx-auto mt-8 mb-4 px-6 py-3 w-fit text-center opacity-90"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        &copy; {new Date().getFullYear()} File Formater. All rights reserved.
      </footer>
    );
  }
  