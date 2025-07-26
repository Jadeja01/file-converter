// pages/api/convert/pdf-to-txt.js
import formidable from "formidable";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw) ? uploadedFilesRaw : [uploadedFilesRaw];

    if (!uploadedFiles || uploadedFiles.size === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const buffer = await fs.readFile(uploadedFiles.filepath);
    const data = await pdfParse(buffer);

    const textFileName = `extracted-${uuidv4()}.txt`;
    const outputPath = path.join(process.cwd(), "public", textFileName);
    await fs.writeFile(outputPath, data.text);

    return res.status(200).json({ success: true, url: `/${textFileName}` });
  } catch (error) {
    console.error("Text extraction failed:", error);
    res.status(500).json({ success: false, message: "Failed to extract text" });
  }
}
