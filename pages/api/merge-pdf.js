// pages/api/merge-pdf.js
import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      filter: ({ mimetype }) => mimetype === "application/pdf"
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw) ? uploadedFilesRaw : [uploadedFilesRaw];

    if (
      !uploadedFiles.length || !uploadedFiles || uploadedFiles.length === 0 ||
      uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")
    ) {
      return res.status(400).json({ success: false, message: "Only non-empty PDF files are allowed." });
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({ success: false, message: "At least 2 PDF files are required to merge." });
    }

    if (uploadedFiles.length > 5) {
      return res.status(400).json({ success: false, message: "You can upload a maximum of 5 files." });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of uploadedFiles) {
      const buffer = await fs.readFile(file.filepath);
      const tempPdf = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBuffer = await mergedPdf.save();
    const mergedFileName = `merged-${uuidv4()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${mergedFileName}"`
    );
    return res.send(Buffer.from(mergedBuffer));


  } catch (error) {
    console.error("Failde to merge PDF", error);
    return res.status(500).json({
      success: false,
      message: "Failed to merge PDF",
      error: error.message,
    });
  }
}
