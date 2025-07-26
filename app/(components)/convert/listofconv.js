export const listOfConversions = [
  {
    from: "pdf",
    to: "docx",
    desc: "Convert PDF documents to editable Word files.",
  },
  { from: "docx", to: "pdf", desc: "Convert Word files to PDF documents." },
  { from: "pptx", to: "pdf", desc: "Convert PowerPoint presentations to PDF." },
  { from: "pdf", to: "pptx", desc: "Convert PDF to PowerPoint presentations." },
  { from: "png", to: "pdf", desc: "Convert PNG images to PDF documents." },
  { from: "jpg", to: "pdf", desc: "Convert JPG images to PDF documents." },
  { from: "mp4", to: "mp3", desc: "Extract audio from video files." },
  { from: "pdf", to: "txt", desc: "Extract text from PDF documents." },
  { from: "txt", to: "pdf", desc: "Convert text files to PDF documents." },
];

export const listOfFormats = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "pptx", label: "PPTX" },
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "mp4", label: "MP4" },
  { value: "mp3", label: "MP3" },
  { value: "txt", label: "TXT" },
];

export const acceptedFormats = {
  pdf: ".pdf",
  docx: ".docx",
  pptx: ".pptx",
  xlsx: ".xlsx",
  png: ".png",
  mp4: ".mp4",
};

export const services = [
  { name: "Document Conversion", icon: "📄", link: "/convert/pdf-to-docx" },
  { name: "Image Conversion", icon: "🖼️", link: "/convert/jpg-to-png" },
  { name: "Bulk Conversion", icon: "📦", link: "/convert/bulk" },
  { name: "Secure Handling", icon: "🔒", link: "/convert/pdf-to-pdf" },
  { name: "Instant Download", icon: "⚡", link: "/convert/pdf-to-txt" },
  { name: "API Access", icon: "🔗", link: "/api" },
];

export const pdfTools = [
  {
    name: "PDF to Word",
    desc: "Convert PDF documents to editable Word files.",
    icon: "📝",
    link: "/pdf-to-word",
  },
  {
    name: "PDF to JPG",
    desc: "Convert PDF pages to high-quality JPG images.",
    icon: "🖼️",
    link: "/pdf-to-jpg",
  },
  {
    name: "Merge PDF",
    desc: "Combine multiple PDF files into one.",
    icon: "➕",
    link: "/merge-pdf",
  },
  {
    name: "Split PDF",
    desc: "Split a PDF into separate pages or ranges.",
    icon: "✂️",
    link: "/split-pdf",
  },
  {
    name: "Compress PDF",
    desc: "Reduce PDF file size for easy sharing.",
    icon: "📉",
    link: "/compress-pdf",
  },
  {
    name: "Rotate PDF",
    desc: "Rotate pages in your PDF document.",
    icon: "🔄",
    link: "/rotate-pdf",
  },
  {
    name: "Protect PDF",
    desc: "Add password protection to your PDF.",
    icon: "🔒",
    link: "/protect-pdf",
  },
  {
    name: "Unlock PDF",
    desc: "Remove password from protected PDF.",
    icon: "🔓",
    link: "/unlock-pdf",
  },
  {
    name: "PDF to Text",
    desc: "Extract text from your PDF files.",
    icon: "📃",
    link: "/pdf-to-text",
  },
  {
    name: "Organize PDF",
    desc: "Reorder or delete pages in your PDF.",
    icon: "🗂️",
    link: "/organize-pdf",
  },
  {
    name: "Add Watermark",
    desc: "Add watermark text or image to PDF.",
    icon: "💧",
    link: "/watermark-pdf",
  },
  {
    name: "Add Page Numbers",
    desc: "Insert page numbers into your PDF.",
    icon: "🔢",
    link: "/add-page-numbers",
  },
];

export const testimonials = [
  {
    name: "Amit Sharma",
    text: "Super easy and fast! Converted my documents in seconds.",
    avatar: "🧑‍💼",
  },
  {
    name: "Priya Patel",
    text: "Love the bulk conversion feature. Saved me hours!",
    avatar: "👩‍💻",
  },
  {
    name: "Rahul Verma",
    text: "Secure and reliable. Highly recommended.",
    avatar: "👨‍🔬",
  },
];

export const operatiosns = [
  {
    value: "Compress PDF",
    href: "/compress-pdf",
    description: "Reduce the size of your PDF file for faster uploads, easier sharing, and saving storage space. Upload your PDF and get a compressed version instantly.",
  },
  {
    value: "Merge PDF",
    href: "/merge-pdf",
    description: "Combine multiple PDF files into a single document. Easily organize and merge your PDFs in one click.",
  },
  {
    value: "Edit PDF",
    href: "/edit-pdf",
    description: "Edit your PDF by adding text, images, annotations, or highlighting important sections. Make changes directly to your PDF file.",
  },
  {
    value: "Rotate PDF",
    href: "/rotate-pdf",
    description: "Rotate pages in your PDF to the correct orientation. Fix upside-down or sideways pages easily.",
  },
  {
    value: "Protect PDF",
    href: "/protect-pdf",
    description: "Add password protection to your PDF to keep your documents secure and private. Set a password before sharing.",
  },
  {
    value: "Unlock PDF",
    href: "/unlock-pdf",
    description: "Remove password protection from your PDF file. Access and edit locked PDFs with ease.",
  },
  {
    value: "Add Watermark",
    href: "/watermark-pdf",
    description: "Add a custom watermark (text or image) to your PDF for branding or copyright protection.",
  },
  {
    value: "Add Page Numbers",
    href: "/add-page-numbers",
    description: "Insert page numbers into your PDF for better organization and easy reference.",
  },  {value:"PDF to Word",href:"/pdf-to-word"},
  {value:"PDF to JPG",href:"/pdf-to-jpg"},
  {value:"PDF to PNG",href:"/pdf-to-png"},
  {value:"PDF to Text",href:"/pdf-to-text"},
  {value:"Word to PDF",href:"/word-to-pdf"},
  {value:"JPG to PDF",href:"/jpg-to-pdf"},
  {value:"PNG to PDF",href:"/png-to-pdf"},
  {value:"Text to PDF", href: "/text-to-pdf" },
  {value:"PDF to DOCX",description:"Convert PDF to DOCX by one click.", href: "/pdf-to-docx" }
];

export const convertPdfOptions = [
  {value:"PDF to Word",href:"/pdf-to-word"},
  {value:"PDF to JPG",href:"/pdf-to-jpg"},
  {value:"PDF to PNG",href:"/pdf-to-png"},
  {value:"PDF to Text",href:"/pdf-to-text"},
  {value:"Word to PDF",href:"/word-to-pdf"},
  {value:"JPG to PDF",href:"/jpg-to-pdf"},
  {value:"PNG to PDF",href:"/png-to-pdf"},
  {value:"Text to PDF", href: "/text-to-pdf" },
];

export const allPdfTools = [
  {value:"PDF to Word",href:"/pdf-to-word"},
  {value:"PDF to JPG",href:"/pdf-to-jpg"},
  {value:"PDF to PNG",href:"/pdf-to-png"},
  {value:"PDF to Text",href:"/pdf-to-text"},
  {value:"Word to PDF",href:"/word-to-pdf"},
  {value:"JPG to PDF",href:"/jpg-to-pdf"},
  {value:"PNG to PDF",href:"/png-to-pdf"},
  {value:"Text to PDF", href: "/text-to-pdf" },
  {value:"Compress PDF",href:"/compress-pdf"},
  {value:"Merge PDF",href:"/merge-pdf"},
  {value:"Edit PDF",href:"/edit-pdf"},
  {value:"Split PDF",href:"/split-pdf"},
  {value:"Rotate PDF",href:"/rotate-pdf"},
  {value:"Protect PDF",href:"/protect-pdf"},
  {value:"Unlock PDF",href:"/unlock-pdf"},
  {value:"Add Watermark",href:"/watermark-pdf"},
  {value:"Add Page Numbers",href:"/add-page-numbers"}

];