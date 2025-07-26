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
    const form = formidable({ multiples: true, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const { files } = await parseForm(req);
    const uploadedFiles = files.file;

    const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    console.log('Uploaded files:', fileArray);
    
    if (fileArray.length < 2) {
      return res.status(400).json({ success: false, message: "At least two files are required" });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of fileArray) {
      const fileBuffer = await readFile(file.filepath);
      const tempPdf = await PDFDocument.load(fileBuffer);
      const pages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBuffer = await mergedPdf.save();

    const fileName = `merged-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);
    await writeFile(outputPath, mergedBuffer);

    return res.status(200).json({ success: true, url: `/${fileName}` });
  } catch (err) {
    console.error("Merge error:", err);
    return res.status(500).json({ success: false, message: "Failed to merge PDF" });
  }
}
