import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req) =>{
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Helper function to wrap lines manually
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width < maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFilesRaw = files.file;
    const uploadedFiles = Array.isArray(uploadedFilesRaw) ? uploadedFilesRaw : [uploadedFilesRaw];

    if (!uploadedFiles || uploadedFiles.size === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const buffer = await fs.readFile(uploadedFiles[0].filepath);
    const textContent = buffer.toString();

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 40;
    const lineHeight = 18;

    let page = pdfDoc.addPage();
    let { width, height } = page.getSize();
    let y = height - margin;

    const paragraphs = textContent.split(/\r?\n/);
    for (const paragraph of paragraphs) {
      const lines = wrapText(paragraph, font, fontSize, width - 2 * margin);
      for (const line of lines) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage();
          y = height - margin;
        }

        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
      y -= lineHeight; // Extra space between paragraphs
    }

    const pdfBytes = await pdfDoc.save();
    const fileName = `converted-${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), "public", fileName);
    await fs.writeFile(outputPath, pdfBytes);

    return res.status(200).json({ success: true, url: `/${fileName}` });
  } catch (error) {
    console.error("Text to PDF failed:", error);
    res.status(500).json({ success: false, message: "Failed to convert text to PDF" });
  }
}
