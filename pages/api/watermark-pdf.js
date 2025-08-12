import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, degrees } from "pdf-lib";
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
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const watermarkText = fields.watermark_text?.[0] || "FriendlyPDF";

    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];

    if (!uploadedFiles || uploadedFiles.length === 0 || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded or file is empty" });
    }

    if (uploadedFiles.length > 5) {
      return res.status(400).json({ success: false, message: "You can upload a maximum of 5 files." });
    }

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const buffer = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 100,
          y: height / 2,
          size: 45,
          rotate: degrees(-45),
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.7,
        });
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nameWithoutExtension}-watermarked.pdf"`
      );
      return res.send(Buffer.from(pdfBytes));
    }

    const zip = new AdmZip();

    for (const file of uploadedFiles) {
      const nameWithoutExtension = path.parse(file.originalFilename).name;
      const buffer = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 100,
          y: height / 2,
          size: 45,
          rotate: degrees(-45),
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.7,
        });
      }

      const pdfBytes = await pdfDoc.save();

      zip.addFile(`${nameWithoutExtension}-watermarked.pdf`, Buffer.from(pdfBytes));
    }

    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="watermarked-files-${uuidv4()}.zip"`
    );
    return res.send(zipBuffer);
  } catch (error) {
    console.error("Failed to watermark PDF", error);
    res.status(500).json({
      success: false,
      message: "Failed to watermark PDF",
      error: error.message,
    });
  }
}
