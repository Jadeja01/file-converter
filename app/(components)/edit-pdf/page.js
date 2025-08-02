import Image from "next/image";

export default function EditPDFPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-10">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 capitalize mb-6">
        EDIT PDF, coming soon...
      </h3>
      <Image
        src="/images/coming-soon.png"
        alt="Coming Soon"
        width={384}
        height={384}
        className="w-64 sm:w-80 md:w-96 h-auto"
      />
      <p className="mt-4 text-gray-500 max-w-md text-sm sm:text-base">
        We&apos;re working hard to bring you this feature. Stay tuned!
      </p>
    </div>
  );
}
