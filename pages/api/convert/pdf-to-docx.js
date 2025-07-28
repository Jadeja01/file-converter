// pages/api/convert/pdf-to-docx.js
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";
import AdmZip from "adm-zip";

export const config = {
  api: { bodyParser: false },
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
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];

    if (uploadedFiles.length === 0 || uploadedFiles.some((f) => f.size === 0)) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const tempFilePaths = [];
    const zip = new AdmZip();

    if (uploadedFiles.length === 1) {
      const originalFilename = uploadedFiles[0].originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const buffer = await fs.readFile(uploadedFiles[0].filepath);
      const pdfData = await pdfParse(buffer);

      const paragraphs = pdfData.text
        .split(/\r?\n/)
        .map((line) => new Paragraph({ children: [new TextRun(line)] }));

      // Create DOCX document
      const doc = new Document({
        creator: "FriendlyPDF",
        title: "Converted PDF",
        description: "Generated from uploaded PDF",
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const docxBuffer = await Packer.toBuffer(doc);
      const fileName = `${nameWithoutExtension}.docx`;
      const outputPath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputPath, docxBuffer);

      tempFilePaths.push(outputPath);

      return res.status(200).json({ success: true, url: `/${fileName}` });
    }

    for (const file of uploadedFiles) {
      const originalFilename = file.originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const buffer = await fs.readFile(file.filepath);
      const pdfData = await pdfParse(buffer);

      const paragraphs = pdfData.text
        .split(/\r?\n/)
        .map((line) => new Paragraph({ children: [new TextRun(line)] }));

      // Create DOCX document
      const doc = new Document({
        creator: "FriendlyPDF",
        title: "Converted PDF",
        description: "Generated from uploaded PDF",
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const docxBuffer = await Packer.toBuffer(doc);
      const fileName = `${nameWithoutExtension}.docx`;
      const outputPath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputPath, docxBuffer);
      tempFilePaths.push(outputPath);
      zip.addLocalFile(outputPath);
    }
    const zipFileName = `converted-${uuidv4()}.zip`;
    const zipOutputPath = path.join(process.cwd(), "public", zipFileName);
    zip.writeZip(zipOutputPath);

    // Clean up temporary PDFs
    await Promise.all(tempFilePaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({ success: true, url: `/${zipFileName}` });
  } catch (error) {
    console.error("PDF to DOCX failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to convert PDF to DOCX" });
  }
}
