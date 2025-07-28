import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { files } = await parseForm(req);
    const uploadedFImagesRaw = files.file;
    const uploadedImages = Array.isArray(uploadedFImagesRaw)
      ? uploadedFImagesRaw
      : [uploadedFImagesRaw];
    console.log("Uploaded images:", uploadedImages);

    if (
      uploadedImages.length === 0 ||
      uploadedImages.some((f) => f.size === 0)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "File is empty or missing" });
    }
    if (uploadedImages.length > 10) {
      return res
        .status(400)
        .json({ success: false, message: "Too many images uploaded" });
    }
    const pdfDoc = await PDFDocument.create();

    for (const img of uploadedImages) {
      const imgBuffer = await fs.readFile(img.filepath);
      const image = sharp(imgBuffer);
      const metadata = await image.metadata();

      const { width, height } = metadata;
      const page = pdfDoc.addPage([width, height]);
      const embeddedImg = await pdfDoc.embedPng(imgBuffer);

      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const filename = `converted-${uuidv4()}.pdf`;
    const outputPath = path.join(
      process.cwd(),
      "public",
      filename
    );
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, pdfBytes);

    return res.status(200).json({success:true, url: `/${filename}` });
  } catch (err) {
    console.error("PNG to PDF error:", err);
    res.status(500).json({ error: "Failed to convert PNG to PDF" });
  }
}
