import formidable from "formidable";
import path from "path";
import fs from "fs";

const uploadsDir = "./public/uploads";

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false, // Important: Disable Next.js's body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const form = formidable({
    uploadDir: uploadsDir, // Files will be saved here initially
    keepExtensions: true, // Keep original file extensions
    // You can add options like maxFileSize, etc.
  });

  try {
    const [fields, files] = await form.parse(req);

    const title = fields.title?.[0]; // Access fields as arrays
    const content = fields.content?.[0];

    // Access the uploaded file
    const uploadedFile = files.image?.[0]; // Assuming your input field name is 'image'

    if (!uploadedFile) {
      // Clean up any partially uploaded files if necessary
      fs.unlink(uploadedFile.filepath, (err) => {
        /* handle error */
      });
      return res.status(400).json({ error: "No image file uploaded." });
    }

    // formidable saves files with a temporary name in uploadDir.
    // You might want to rename it or just use the generated name.
    // For simplicity, we'll use the name formidable gave it.
    // If you want a specific name (like Date.now() + original extension),
    // you'd need to rename the file after parsing.

    // Example of renaming (optional, formidable already saves it):
    // const oldPath = uploadedFile.filepath;
    // const newFilename = Date.now() + path.extname(uploadedFile.originalFilename);
    // const newPath = path.join(uploadsDir, newFilename);
    // fs.renameSync(oldPath, newPath); // Or fs.promises.rename(oldPath, newPath);
    // const imageUrl = `/uploads/${newFilename}`;

    const imageUrl = `/uploads/${path.basename(uploadedFile.filepath)}`;

    res.status(201).json({ title, content, imageUrl });
  } catch (error) {
    console.error("Error parsing form data:", error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
