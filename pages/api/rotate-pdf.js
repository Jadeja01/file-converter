import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, degrees } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { fields, files } = await parseForm(req);
    const pdf = files.file;
    const angle = parseInt(fields.angle || "90");
    console.log('angle:', angle);
    

    if (!pdf || !angle)
      return res.status(400).json({ message: "PDF or angle missing" });

    const pdfBytes = await fs.readFile(pdf[0].filepath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }

    const modifiedPdf = await pdfDoc.save();
    const fileName = `rotated-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);
    await fs.writeFile(outputPath, modifiedPdf);

    res.status(200).json({ success: true, url: `/${fileName}` });
  } catch (error) {
    console.error("Rotate PDF error:", error);
    return res.status(500).json({
      success: false,
      message: "Compression failed",
      error: error.message,
    });
  }
}
