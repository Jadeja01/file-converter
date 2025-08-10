// pages/api/merge-pdf.js
import formidable from "formidable";
import { readFile, writeFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
import path from "path";
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
      maxFileSize: 10 * 1024 * 1024, 
      filter: ({ mimetype }) => mimetype === "application/pdf",
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

    if (!uploadedFiles || uploadedFiles.length < 2 || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")) {
      return res.status(400).json({
        success: false,
        message: "At least two non-empty PDF files are required",
      });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of uploadedFiles) {
      const buffer = await readFile(file.filepath);
      const tempPdf = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBuffer = await mergedPdf.save();
    const fileName = `merged-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);

    await writeFile(outputPath, mergedBuffer);

    return res.status(200).json({ success: true, url: `/${fileName}` });
  } catch (err) {
    console.error("Merge error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to merge PDF",
      error: err.message,
    });
  }
}
