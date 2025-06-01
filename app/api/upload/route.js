// app/api/upload/route.js
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import matter from "gray-matter"; // Still needed if you intend to keep markdown files in 'content' processed by gray-matter

// Define paths for uploads and blog data file
const uploadsDir = path.join(process.cwd(), "public", "uploads");
const dataDir = path.join(process.cwd(), "data"); // Directory for our JSON file
const blogsDataFile = path.join(dataDir, "blogs.json"); // Path to the JSON file

// Ensure 'data' directory exists (synchronously, as it's needed immediately on server start)
if (!existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true }); // Using sync version for initial setup
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const content = formData.get("content");
    const description = formData.get("description"); // <-- NEW: Get description from form data

    // Set defaults or validate
    const author = formData.get("author") || "Aditi"; // You might add an author field to your form
    const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-*|-*$/g, ""); // Generate slug

    // Basic validation
    if (!title || !content || !description || !file) {
      // Image is now required
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all fields and select an image.",
        },
        { status: 400 }
      );
    }

    // Process image upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);
    const imageUrl = `/uploads/${filename}`; // Public URL for the image

    // --- Start: Read, update, and write to JSON file ---
    let existingBlogs = [];
    // Read existing blogs from the JSON file if it exists
    if (existsSync(blogsDataFile)) {
      const data = await readFile(blogsDataFile, "utf-8");
      existingBlogs = JSON.parse(data);
    }

    // Create a new blog entry
    const newBlogEntry = {
      title,
      description, // <-- Store the description
      slug,
      date,
      author,
      image: imageUrl,
      content, // This is the plain text content from the textarea
      isUploaded: true, // A flag to distinguish uploaded posts
    };

    // Add the new blog entry to the array (or replace if slug already exists, simple version)
    existingBlogs = existingBlogs.filter((blog) => blog.slug !== slug); // Remove old entry if same slug
    existingBlogs.push(newBlogEntry);

    // Write the updated array back to the JSON file
    await writeFile(blogsDataFile, JSON.stringify(existingBlogs, null, 2));
    // --- End: Read, update, and write to JSON file ---

    return NextResponse.json(
      {
        success: true,
        message: "Blog post uploaded and data saved successfully.",
        title,
        imageUrl,
        slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create blog post.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
