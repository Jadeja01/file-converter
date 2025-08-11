import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";
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

    if (uploadedFiles.length >5){
      return res.status(400).json({ success: false, message: "You can upload a maximum of 5 files." });
    }

    if (uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const nameWithoutExtension = path.parse(file.originalFilename).name;
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

      const modifiedPdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nameWithoutExtension}-paged.pdf"`
      );
      return res.send(Buffer.from(modifiedPdfBytes));
    }

    const zip = new AdmZip();

    for (const file of uploadedFiles) {
      const nameWithoutExtension = path.parse(file.originalFilename).name;
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

      const modifiedPdfBytes = await pdfDoc.save();
      zip.addFile(`${nameWithoutExtension}-paged.pdf`, Buffer.from(modifiedPdfBytes));
    }

    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="paged-files-${uuidv4()}.zip"`
    );
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
