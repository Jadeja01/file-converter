import AdmZip from "adm-zip";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
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
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
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
    const { fields, files } = await parseForm(req);

    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];
    const rangesInput = fields.ranges;


    if (
      !uploadedFiles.length || !uploadedFiles || uploadedFiles.length === 0 ||
      uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")
    ) {
      return res.status(400).json({ success: false, message: "Only non-empty PDF files are allowed." });
    }

    if (!rangesInput || typeof rangesInput[0] !== "string") {
      return res.status(400).json({ success: false, message: "Valid page ranges required (e.g., 1-3,4,5-6)" });
    }
    const rangesArray = Array.isArray(rangesInput) ? rangesInput : [rangesInput]
    const fileBuffer = await fs.readFile(uploadedFiles[0].filepath);
    const originalDoc = await PDFDocument.load(fileBuffer);
    const nameWithoutExtension = path.parse(uploadedFiles[0].originalFilename).name;

    for (const rangeStr of rangesArray) {
      const parts = rangeStr.split(",").map((p) => p.trim());

      if (parts.length === 1) {
        const part = parts[0];
        const pages = new Set();
        if (part.includes("-")) {
          const [start, end] = part.split("-").map((n) => parseInt(n, 10));
          if (isNaN(start) || isNaN(end) || start < 1 || end > originalDoc.getPageCount() || start > end) {
            return res.status(400).json({ success: false, message: `Invalid range: ${part}` });
          }
          for (let i = start; i <= end; i++) pages.add(i - 1);
        } else {
          const pageNum = parseInt(part, 10);
          if (isNaN(pageNum) || pageNum < 1 || pageNum > originalDoc.getPageCount()) {
            return res.status(400).json({ success: false, message: `Invalid page number: ${part}` });
          }
          pages.add(pageNum - 1);
        }
        const splitter = await PDFDocument.create();
        const copiedPages = await splitter.copyPages(originalDoc, Array.from(pages));
        copiedPages.forEach((page) => splitter.addPage(page));
        const finalBuffer = await splitter.save();
        const safeName = part.replace(/[^0-9-]/g, "");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nameWithoutExtension}-splited-page-${safeName}.pdf"`
        );
        return res.send(Buffer.from(finalBuffer));
      } else {
        const zip = new AdmZip();
        for (const part of parts) {
          const pages = new Set();
          if (part.includes("-")) {
            const [start, end] = part.split("-").map((n) => parseInt(n, 10));
            if (isNaN(start) || isNaN(end) || start < 1 || end > originalDoc.getPageCount() || start > end) {
              return res.status(400).json({ success: false, message: `Invalid range: ${part}` });
            }
            for (let i = start; i <= end; i++) pages.add(i - 1);
          } else {
            const pageNum = parseInt(part, 10);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > originalDoc.getPageCount()) {
              return res.status(400).json({ success: false, message: `Invalid page number: ${part}` });
            }
            pages.add(pageNum - 1);
          }

          const splitter = await PDFDocument.create();
          const copiedPages = await splitter.copyPages(originalDoc, Array.from(pages));
          copiedPages.forEach((page) => splitter.addPage(page));

          const finalBuffer = await splitter.save();
          const safeName = part.replace(/[^0-9-]/g, "");
          zip.addFile(`${nameWithoutExtension}-splited-page-${safeName}.pdf`, Buffer.from(finalBuffer));
        }
        const zipBuffer = zip.toBuffer();
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="splitted-files-${uuidv4()}.zip"`
        );
        res.send(zipBuffer);
      }
    }
  } catch (error) {
    console.error("Failed to split PDF:", error);
    res.status(500).json({ success: false, message: "Failed to split PDF", error: error.message });
  }
}
