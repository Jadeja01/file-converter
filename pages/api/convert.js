import formidable from "formidable";
import CloudConvert from "cloudconvert";
import { readFile } from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

const parseForm = (req) =>{
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  try {
    const user = await cloudConvert.users.me();
    console.log('User:', user);
    
    const { fields, files } = await parseForm(req);
    const conversionType = fields.conversionType?.[0];
    const uploaded = files.file?.[0];

    if (!uploaded || uploaded.size === 0 || !conversionType) {
      return res.status(400).json({ success: false, message: "Invalid file or conversion type." });
    }

    const inputBuffer = await readFile(uploaded.filepath);
    const originalFilename = uploaded.originalFilename;
    const [inputFormat, outputFormat] = conversionType.split("-to-");

    const job = await cloudConvert.jobs.create({
      tasks: {
        upload: { operation: "import/upload" },
        convert: {
          operation: "convert",
          input: "upload",
          input_format: inputFormat,
          output_format: outputFormat,
        },
        export: { operation: "export/url", input: "convert" },
      },
    });

    const uploadTask = job.tasks.find((task) => task.name === "upload");

    await cloudConvert.tasks.upload(uploadTask, inputBuffer, originalFilename);

    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find((task) => task.name === "export");

    const fileUrl = exportTask.result.files[0].url;

    return res.status(200).json({ success: true, url: fileUrl });

  } catch (error) {
    console.error("Conversion failed:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}
