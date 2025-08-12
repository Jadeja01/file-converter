import AdmZip from "adm-zip";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, degrees } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      filter: ({ mimetype }) => mimetype === "application/pdf"
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { fields, files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];
    const angle = parseInt(fields.angle);
    

    if (!uploadedFiles || uploadedFiles.length === 0 || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf") || isNaN(angle) || angle < 0 || angle > 360) {
      return res.status(400).json({ message: "No file uploaded or file is empty or angle is not valid" });
    }

    if (uploadedFiles.length > 5) {
      return res.status(400).json({ success: false, message: "You can upload a maximum of 5 files." });
    }

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const pdfBytes = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
      }

      const modifiedPdf = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nameWithoutExtension}-rotated.pdf"`
      );
      return res.send(Buffer.from(modifiedPdf));
    }

    const zip = new AdmZip();

    for (const file of uploadedFiles) {
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const pdfBytes = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
      }

      const modifiedPdf = await pdfDoc.save();

      zip.addFile(`${nameWithoutExtension}-rotated.pdf`, Buffer.from(modifiedPdf));
    }
    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rotated-files-${uuidv4()}.zip"`
    );
    return res.send(zipBuffer);
  } catch (error) {
    console.error("Failed to rotate PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rotate PDF:",
      error: error.message,
    });
  }
}
