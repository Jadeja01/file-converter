import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) =>{
  return new Promise((resolve, reject) => {
    const form = formidable({multiples:false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const uploaded = files.file;
    const watermarkText = fields.watermark_text?.[0] || "FriendlyPDF";
    console.log('Watermark text:', watermarkText);
    

    if (!uploaded || uploaded.size === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const buffer = await fs.readFile(uploaded[0].filepath);
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
    const fileName = `watermarked-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);

    await fs.writeFile(outputPath, pdfBytes);

    res.status(200).json({
      success: true,
      url: `/${fileName}`,
    });
  } catch (err) {
    console.error("Watermarking failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to watermark PDF" });
  }
}
