// pages/api/add-page-numbers.js
import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];
    console.log("Uploaded files:", uploadedFiles[0].originalFilename);

    if (uploadedFiles.length === 0 || uploadedFiles.some((f) => f.size === 0)) {
      return res
        .status(400)
        .json({ success: false, message: "File is empty or missing" });
    }
    const tempFilePaths = [];
    const zip = new AdmZip();

    if (uploadedFiles.length === 1) {
      const originalFilename = uploadedFiles[0].originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const fileData = await fs.readFile(uploadedFiles[0].filepath);
      const pdfDoc = await PDFDocument.load(fileData);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        page.drawText(`Page ${idx + 1}`, {
          x: width - 70,
          y: 20,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const modifiedPdf = await pdfDoc.save();
      const fileName = `${nameWithoutExtension}-paged.pdf`;
      const outputFilePath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputFilePath, modifiedPdf);

      tempFilePaths.push(outputFilePath);

      return res.status(200).json({
        success: true,
        url: `/${fileName}`,
      });
    }

    for (const file of uploadedFiles) {
      const originalFilename = file.originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const fileData = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(fileData);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        page.drawText(`Page ${idx + 1}`, {
          x: width - 70,
          y: 20,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const modifiedPdf = await pdfDoc.save();
      const fileName = `${nameWithoutExtension}-paged.pdf`;
      const outputFilePath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputFilePath, modifiedPdf);

      tempFilePaths.push(outputFilePath);
      zip.addLocalFile(outputFilePath);
    }

    const zipName = `compressed-${uuidv4()}.zip`;
    const zipPath = path.join(process.cwd(), "public", zipName);
    zip.writeZip(zipPath);

    // Clean up temporary PDFs
    await Promise.all(tempFilePaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({
      success: true,
      url: `/${zipName}`,
    });
  } catch (err) {
    console.error("Page number error:", err);
    res.status(500).json({ error: "Failed to add page numbers" });
  }
}
