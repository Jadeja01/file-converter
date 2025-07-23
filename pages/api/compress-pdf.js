import formidable from "formidable";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  console.log("Req.method:", req.method);
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFile = files.file;

    if (!uploadedFile || uploadedFile.size === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }

    const buffer = await readFile(uploadedFile[0].filepath);

    // Load the existing PDF
    const originalPdf = await PDFDocument.load(buffer);

    // Create a new PDF to reduce size
    const compressedPdf = await PDFDocument.create();
    const copiedPages = await compressedPdf.copyPages(
      originalPdf,
      originalPdf.getPageIndices()
    );
    copiedPages.forEach((page) => compressedPdf.addPage(page));

    const compressedBuffer = await compressedPdf.save();

    // Save the compressed PDF
    const fileName = `compressed-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);
    await writeFile(outputPath, compressedBuffer);

    return res.status(200).json({
      success: true,
      url: `/${fileName}`,
    });
  } catch (error) {
    console.error("Compression failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Compression failed" });
  }
}
