// pages/api/compress-pdf.js
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

    if (!uploadedFiles.length || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")) {
      return res.status(400).json({ success: false, message: "Only non-empty PDF files are allowed." });
    }

    const tempPaths = [];
    const zip = new AdmZip();

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const buffer = await fs.readFile(file.filepath);

      const originalPdf = await PDFDocument.load(buffer);
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      const compressedBuffer = await compressedPdf.save();

      const fileName = `${nameWithoutExtension}-compressed.pdf`;
      const outputPath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputPath, compressedBuffer);

      return res.status(200).json({
        success: true,
        url: `/${fileName}`,
      });
    }

    for (const file of uploadedFiles) {
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const buffer = await fs.readFile(file.filepath);

      const originalPdf = await PDFDocument.load(buffer);
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      const compressedBuffer = await compressedPdf.save();

      const tempName = `${nameWithoutExtension}-compressed.pdf`;
      const tempPath = path.join(process.cwd(), "public", tempName);

      await fs.writeFile(tempPath, compressedBuffer);
      zip.addLocalFile(tempPath);
      tempPaths.push(tempPath);
    }

    const zipName = `compressed-${uuidv4()}.zip`;
    const zipPath = path.join(process.cwd(), "public", zipName);
    zip.writeZip(zipPath);

    await Promise.all(tempPaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({
      success: true,
      url: `/${zipName}`,
    });
  } catch (error) {
    console.error("Compression failed:", error);
    return res.status(500).json({
      success: false,
      message: "Compression failed",
      error: error.message,
    });
  }
}
