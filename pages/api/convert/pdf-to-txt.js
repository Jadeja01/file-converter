// pages/api/convert/pdf-to-txt.js
import formidable from "formidable";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw) ? uploadedFilesRaw : [uploadedFilesRaw];

    if (!uploadedFiles || uploadedFiles.size === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded or file is empty" });
    }

    const tempFilePaths = [];
    const zip = new AdmZip();


    if (uploadedFiles.length === 1) {
      const originalFilename = uploadedFiles[0].originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const buffer = await fs.readFile(uploadedFiles[0].filepath);
      const data = await pdfParse(buffer);
      const textFileName = `${nameWithoutExtension}-extracted.txt`;
      const outputPath = path.join(process.cwd(), "public", textFileName);
      await fs.writeFile(outputPath, data.text);
      tempFilePaths.push(outputPath);
      return res.status(200).json({ success: true, url: `/${textFileName}` });
    }

    for (const file of uploadedFiles) {
      const originalFilename = file.originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const buffer = await fs.readFile(file.filepath);
      const data = await pdfParse(buffer);
      const textFileName = `${nameWithoutExtension}-extracted.txt`;
      const outputPath = path.join(process.cwd(), "public", textFileName);
      await fs.writeFile(outputPath, data.text);
      tempFilePaths.push(outputPath);
      zip.addLocalFile(outputPath);
    }
    const zipFileName = `extracted-${uuidv4()}.zip`;
    const zipFilePath = path.join(process.cwd(), "public", zipFileName);
    zip.writeZip(zipFilePath);

    await Promise.all(tempFilePaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({ success: true, url: `/${zipFileName}` });
  } catch (error) {
    console.error("Text extraction failed:", error);
    res.status(500).json({ success: false, message: "Failed to convert pdf to txt", error: "Conversion failed" });
  }
}
