import formidable from "formidable";
import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true }, { keepExtensions: true });
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
      const { width, height } = await sharp(imgBuffer).metadata();

      const page = pdfDoc.addPage([width, height]);

      const embeddedImage = await pdfDoc.embedJpg(imgBuffer);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const finalPdf = await pdfDoc.save();
    const filename = `converted-${uuidv4()}.pdf`;
    const outPath = path.join(process.cwd(), "public", filename);
    await fs.writeFile(outPath, finalPdf);

    return res.status(200).json({success:true, url: `/${filename}` });
  } catch (error) {
    console.error("JPG to PDF error:", error);
    return res.status(500).json({
      success: false,
      message: "Compression failed",
      error: "Failed to convert JPG to PDF",
    });
  }
}
