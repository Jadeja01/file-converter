import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, keepExtensions: true });
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

    if (!uploadedFilesRaw) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadedFiles = Array.isArray(uploadedFilesRaw) ? uploadedFilesRaw : [uploadedFilesRaw];

    if (uploadedFiles.length === 0 || uploadedFiles.some(f => f.size === 0)) {
      return res.status(400).json({ success: false, message: "File is empty or missing" });
    }

    // ✅ Handle Single File Upload (No ZIP)
    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const buffer = await fs.readFile(file.filepath);

      const originalPdf = await PDFDocument.load(buffer);
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      const compressedBuffer = await compressedPdf.save();

      const fileName = `compressed-${uuidv4()}.pdf`;
      const outputPath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputPath, compressedBuffer);

      return res.status(200).json({
        success: true,
        url: `/${fileName}`,
      });
    }

    // ✅ Handle Multiple File Uploads → Compress Each → ZIP
    const zip = new AdmZip();
    const tempPaths = [];

    for (const file of uploadedFiles) {
      const buffer = await fs.readFile(file.filepath);

      const originalPdf = await PDFDocument.load(buffer);
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      const compressedBuffer = await compressedPdf.save();

      const tempName = `compressed-${uuidv4()}.pdf`;
      const tempPath = path.join(process.cwd(), "public", tempName);

      await fs.writeFile(tempPath, compressedBuffer);
      zip.addLocalFile(tempPath);
      tempPaths.push(tempPath);
    }

    // Save ZIP file to public
    const zipName = `compressed-${uuidv4()}.zip`;
    const zipPath = path.join(process.cwd(), "public", zipName);
    zip.writeZip(zipPath);

    // Clean up temporary PDFs
    await Promise.all(tempPaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({
      success: true,
      url: `/${zipName}`,
    });

  } catch (error) {
    console.error("Compression failed:", error);
    return res.status(500).json({ success: false, message: "Compression failed", error: error.message });
  }
}
