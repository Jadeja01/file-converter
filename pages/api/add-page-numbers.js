// pages/api/add-page-numbers.js
import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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
      filter: ({ mimetype }) => mimetype === "application/pdf"
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method not allowed");

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];

    if (
      !uploadedFiles.length ||
      uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")
    ) {
      return res.status(400).json({ success: false, message: "Only non-empty PDF files are allowed." });
    }

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const fileData = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(fileData);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, idx) => {
        const { width } = page.getSize();
        page.drawText(`Page ${idx + 1}`, {
          x: width - 70,
          y: 20,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const modifiedPdf = await pdfDoc.save();

      // ✅ Send buffer as downloadable PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="paged-output.pdf"');
      return res.send(Buffer.from(modifiedPdf));
    }

    // For multiple files: zip them and send
    const zip = new AdmZip();

    for (const file of uploadedFiles) {
      const fileData = await fs.readFile(file.filepath);
      const pdfDoc = await PDFDocument.load(fileData);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, idx) => {
        const { width } = page.getSize();
        page.drawText(`Page ${idx + 1}`, {
          x: width - 70,
          y: 20,
          size: 12,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const modifiedPdf = await pdfDoc.save();
      const fileName = file.originalFilename.replace(/\.pdf$/, '') + "-paged.pdf";

      zip.addFile(fileName, Buffer.from(modifiedPdf));
    }

    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="paged-files-${uuidv4().slice(0, 6)}.zip"`);
    return res.send(zipBuffer);

  } catch (error) {
    console.error("Failed to add page numbers", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add page numbers",
      error: error.message,
    });
  }
}
