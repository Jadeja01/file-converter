// pages/api/split-pdf.js
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
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    console.log("Parsed fields:", fields);

    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];

    if (!uploadedFiles || uploadedFiles.length === 0 || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded or file is empty" });
    }

    const ranges = fields.ranges;
    console.log("Parsed ranges:", ranges);

    if (!ranges || typeof ranges[0] !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Page ranges required" });
    }

    const tempSplitedFilePaths = [];
    const zip = new AdmZip();
    for (const range of ranges) {
      const parts = range.split(",").map((p) => p.trim());
      console.log("Parts:", parts);

      for (const range of parts) {
        console.log("Processing range:", range);
        const pages = new Set();

        if (range.includes("-")) {
          const [start, end] = range.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            pages.add(i - 1);
          }
        } else {
          pages.add(Number(range) - 1);
        }

        const pageIndices = Array.from(pages).filter((n) => !isNaN(n));
        console.log("Page indices:", pageIndices);
        if (!pageIndices.length) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid range input" });
        }

        const buffer = await fs.readFile(uploadedFiles[0].filepath);
        const original = await PDFDocument.load(buffer);
        const splitter = await PDFDocument.create();

        const copiedPages = await splitter.copyPages(original, pageIndices);
        copiedPages.forEach((page) => splitter.addPage(page));

        const finalBuffer = await splitter.save();
        const fileName = `splited-page-${range.replace(/[^0-9-]/g, '')}-${uuidv4()}.pdf`;
        const filePath = path.join(process.cwd(), "public", fileName);

        await fs.writeFile(filePath, finalBuffer);
        zip.addLocalFile(filePath);
        tempSplitedFilePaths.push(filePath);
        console.log("Saving split file:", filePath);
      }
    }
    const zipName = `splited-${uuidv4()}.zip`;
    const zipPath = path.join(process.cwd(), "public", zipName);
    zip.writeZip(zipPath);

    await Promise.all(
      tempSplitedFilePaths.map((filePath) => fs.unlink(filePath))
    );

    return res.status(200).json({
      success: true,
      url: `/${zipName}`,
    });
  } catch (err) {
    console.error("Split failed:", err);
    res.status(500).json({ success: false, message: "Failed to split PDF", error: err.message });
  }
}
