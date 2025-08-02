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
      maxFileSize: 10 * 1024 * 1024,
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
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const watermarkText = fields.watermark_text?.[0] || "FriendlyPDF";
    console.log("Watermark text:", watermarkText);

    const uploadedFiles = Array.isArray(uploadedFilesRaw)
      ? uploadedFilesRaw
      : [uploadedFilesRaw];
    console.log("Uploaded files:", uploadedFiles);

    if (!uploadedFiles || uploadedFiles.length === 0 || uploadedFiles.some((f) => !f || f.size === 0 || f.mimetype !== "application/pdf")) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded or file is empty" });
    }
    const tempFilePaths = [];
    const zip = new AdmZip();

    if (uploadedFiles.length === 1) {
      const originalFilename = uploadedFiles[0].originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
      const buffer = await fs.readFile(uploadedFiles[0].filepath);
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
      const fileName = `${nameWithoutExtension}-watermarked}.pdf`;
      const outputPath = path.join(process.cwd(), "public", fileName);

      await fs.writeFile(outputPath, pdfBytes);
      tempFilePaths.push(outputPath);
      return res.status(200).json({
        success: true,
        url: `/${fileName}`,
      });
    }
    for (const file of uploadedFiles) {
      const originalFilename = file.originalFilename;
      const nameWithoutExtension = path.parse(originalFilename).name;
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
      const fileName = `${nameWithoutExtension}-watermarked}.pdf`;
      const outputPath = path.join(process.cwd(), "public", fileName);
      await fs.writeFile(outputPath, pdfBytes);
      tempFilePaths.push(outputPath);
      zip.addLocalFile(outputPath);
    }

    const zipFileName = `watermarked-${uuidv4()}.zip`;
    const zipFilePath = path.join(process.cwd(), "public", zipFileName);
    zip.writeZip(zipFilePath);

    await Promise.all(tempFilePaths.map((filePath) => fs.unlink(filePath)));

    return res.status(200).json({
      success: true,
      url: `/${zipFileName}`,
    });
  } catch (err) {
    console.error("Watermarking failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to watermark PDF", error: err.message, });
  }
}
