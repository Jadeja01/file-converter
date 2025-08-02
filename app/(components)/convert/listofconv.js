// used 
export const pdfFormats = [
  { label: "PDF", value: "pdf" },
  { label: "Word (DOCX)", value: "docx" },
  { label: "JPG", value: "jpg" },
  { label: "PNG", value: "png" },
  { label: "Text (TXT)", value: "txt" },
];

// used 
export const pdfConversions = [
  { from: "pdf", to: "docx", desc: "Convert PDF to editable Word document." },
  { from: "pdf", to: "jpg", desc: "Convert PDF pages to JPG images." },
  { from: "pdf", to: "png", desc: "Convert PDF pages to PNG images." },
  { from: "pdf", to: "txt", desc: "Extract text from PDF." },
  { from: "docx", to: "pdf", desc: "Convert Word document to PDF." },
  { from: "jpg", to: "pdf", desc: "Convert JPG image to PDF." },
  { from: "png", to: "pdf", desc: "Convert PNG image to PDF." },
  { from: "txt", to: "pdf", desc: "Convert text file to PDF." },
];

// used 
export const pdfTools = [
  {
    name: "PDF to Word",
    desc: "Convert PDF documconvert/ents to editable Word files.",
    icon: "📝",
    link: "/convert/pdf-to-docx",
  },
  {
    name: "PDF to JPG",
    desc: "Convert PDF pages to high-quality JPG images.",
    icon: "🖼️",
    link: "/convert/pdf-to-jpg",
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
    link: "/convert/pdf-to-txt",
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


// used 
export const operatiosns = [
  {
    value: "Compress PDF",
    href: "/compress-pdf",
    description:
      "Reduce the size of your PDF file for faster uploads, easier sharing, and saving storage space. Upload your PDF and get a compressed version instantly.",
  },
  {
    value: "Merge PDF",
    href: "/merge-pdf",
    description:
      "Combine multiple PDF files into a single document. Easily organize and merge your PDFs in one click.",
  },
  {
    value: "Edit PDF",
    href: "/edit-pdf",
    description:
      "Edit your PDF by adding text, images, annotations, or highlighting important sections. Make changes directly to your PDF file.",
  },
  {
    value: "Rotate PDF",
    href: "/rotate-pdf",
    description:
      "Rotate pages in your PDF to the correct orientation. Fix upside-down or sideways pages easily.",
  },
  {
    value: "Protect PDF",
    href: "/protect-pdf",
    description:
      "Add password protection to your PDF to keep your documents secure and private. Set a password before sharing.",
  },
  {
    value: "Unlock PDF",
    href: "/unlock-pdf",
    description:
      "Remove password protection from your PDF file. Access and edit locked PDFs with ease.",
  },
  {
    value: "Add Watermark",
    href: "/watermark-pdf",
    description:
      "Add a custom watermark (text or image) to your PDF for branding or copyright protection.",
  },
  {
    value: "Add Page Numbers",
    href: "/add-page-numbers",
    description:
      "Insert page numbers into your PDF for better organization and easy reference.",
  },
  {
    value: "PDF to Word",
    href: "/convert/pdf-to-docx",
    description:
      "Convert your PDF into an editable Word document (.docx) while retaining layout and formatting.",
  },
  {
    value: "PDF to JPG",
    href: "/convert/pdf-to-jpg",
    description:
      "Convert each page of your PDF into high-quality JPG images for easy sharing or use.",
  },
  {
    value: "PDF to PNG",
    href: "/convert/pdf-to-png",
    description:
      "Convert PDF pages into PNG images while preserving quality and transparency.",
  },
  {
    value: "PDF to Text",
    href: "/convert/pdf-to-txt",
    description:
      "Extract raw text content from your PDF file for editing or copying without formatting.",
  },
  {
    value: "Word to PDF",
    href: "/convert/docx-to-pdf",
    description:
      "Convert Word documents (.docx) into PDF files while preserving fonts and structure.",
  },
  {
    value: "JPG to PDF",
    href: "/convert/jpg-to-pdf",
    description:
      "Turn one or more JPG images into a single PDF file quickly and easily.",
  },
  {
    value: "PNG to PDF",
    href: "/convert/png-to-pdf",
    description:
      "Convert PNG images to PDF format with high resolution and accuracy.",
  },
  {
    value: "Text to PDF",
    href: "/convert/txt-to-pdf",
    description:
      "Convert plain text files (.txt) into PDF documents with clean formatting.",
  },
];


// used
export const convertPdfOptions = [
  {value:"PDF to Word",href:"/convert/pdf-to-docx"},
  {value:"PDF to JPG",href:"/convert/pdf-to-jpg"},
  {value:"PDF to PNG",href:"/convert/pdf-to-png"},
  {value:"PDF to Text",href:"/convert/pdf-to-txt"},
  {value:"Word to PDF",href:"/convert/docx-to-pdf"},
  {value:"JPG to PDF",href:"/convert/jpg-to-pdf"},
  {value:"PNG to PDF",href:"/convert/png-to-pdf"},
  {value:"Text to PDF", href: "/convert/txt-to-pdf" },
];

// used
export const allPdfTools = [
  {value:"PDF to Word",href:"/convert/pdf-to-docx"},
  {value:"PDF to JPG",href:"/convert/pdf-to-jpg"},
  {value:"PDF to PNG",href:"/convert/pdf-to-png"},
  {value:"PDF to Text",href:"/convert/pdf-to-txt"},
  {value:"Word to PDF",href:"/convert/docx-to-pdf"},
  {value:"JPG to PDF",href:"/convert/jpg-to-pdf"},
  {value:"PNG to PDF",href:"/convert/png-to-pdf"},
  {value:"Text to PDF", href: "/convert/txt-to-pdf" },

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