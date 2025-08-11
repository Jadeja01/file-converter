// pages/api/compress-pdf.js
import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import AdmZip from "adm-zip";
import { v4 as uuidv4 } from "uuid";
import path from "path";

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
      maxFileSize: 20 * 1024 * 1024, // 20MB limit
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
    return res.status(405).send("Method not allowed");
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];

    if (
      !uploadedFiles.length || !uploadedFiles || uploadedFiles.length === 0 ||
      uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")
    ) {
      return res.status(400).json({ success: false, message: "Only non-empty PDF files are allowed." });
    }

    if (uploadedFiles.length > 5) {
      return res.status(400).json({ success: false, message: "You can upload a maximum of 5 files." });
    }

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const fileData = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(fileData);

      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nameWithoutExtension}-compressed.pdf"`
      );
      return res.send(Buffer.from(compressedPdfBytes));
    }


    const zip = new AdmZip();
    for (const file of uploadedFiles) {
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const fileData = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(fileData);
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      zip.addFile(`${nameWithoutExtension}-paged.pdf`, Buffer.from(compressedPdfBytes), "Compressed PDF file");
    }

    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compressed-files-${uuidv4()}.zip"`
    );
    return res.send(zipBuffer);

  } catch (error) {
    console.error("Error compressing PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error compressing PDF",
      error: error.message,
    });
  }
}
