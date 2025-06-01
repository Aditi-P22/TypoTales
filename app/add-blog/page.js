"use client";
import { useState, useRef } from "react"; // Import useRef
import { Button } from "@/components/ui/button"; // Assuming this is your Shadcn UI Button

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // To determine message style
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const messageRef = useRef(null); // Ref for the message div

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Uploading blog post...");
    setIsSuccess(false); // Reset message state for new submission

    // 1. Basic validation - now includes description
    if (!title || !description || !content || !image) {
      setMessage("Please fill in all fields and select an image.");
      setIsSuccess(false);
      // Scroll to the message div to make it visible
      if (messageRef.current) {
        messageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // 2. Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("image", image);

    try {
      // 3. Send the request to the new App Router API endpoint
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // 4. Parse the response
      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        setMessage("✅ Blog submitted successfully! Your post is now live.");
        setIsSuccess(true);
        setUploadedImageUrl(data.imageUrl); // Store the returned image URL
        // Clear form fields
        setTitle("");
        setDescription("");
        setContent("");
        setImage(null);
        setPreview(null);
        // Reset file input value
        if (e.target.elements.image) {
          e.target.elements.image.value = "";
        }
      } else {
        // Handle errors from the API route
        setMessage(
          `❌ Submission failed: ${
            data.message || "Unknown error"
          }. Please try again.`
        );
        setIsSuccess(false);
      }
    } catch (error) {
      // Handle network errors or other client-side issues
      console.error("Fetch error:", error);
      setMessage(
        `❌ An error occurred: ${error.message}. Please check your connection and try again.`
      );
      setIsSuccess(false);
    } finally {
      // Always scroll to the message after submission attempt
      if (messageRef.current) {
        messageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Create a URL for image preview
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 py-14 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-8 tracking-tight">
          📝 Write a Blog Post
        </h1>

        {/* --- Dynamic Message Alert --- */}
        {message && (
          <div
            ref={messageRef} // Attach the ref here
            className={`flex items-center justify-between px-6 py-4 rounded-lg mb-8 transition-all duration-300 ease-in-out ${
              isSuccess
                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-200 dark:border-green-600"
                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 border border-red-200 dark:border-red-600"
            } shadow-md`}
            role="alert"
          >
            <span className="font-semibold text-lg">{message}</span>
            <Button
              variant="ghost" // Use a ghost variant for a subtle close button
              size="icon"
              onClick={() => setMessage("")} // Clear message on click
              className={`text-${
                isSuccess ? "green-600" : "red-600"
              } hover:bg-transparent hover:text-${
                isSuccess ? "green-800" : "red-800"
              } dark:text-${
                isSuccess ? "green-300" : "red-300"
              } dark:hover:text-${isSuccess ? "green-100" : "red-100"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close alert</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter blog title..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              placeholder="A short summary of your blog post..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Content (Markdown accepted)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="12" // Increased rows for content for better writing experience
              placeholder="Start writing your amazing blog post here... You can use Markdown for formatting!"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="image-upload"
              className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Upload Featured Image
            </label>
            <input
              type="file"
              id="image-upload" // Changed ID to avoid conflict with name
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800 transition-all duration-200 ease-in-out" // Custom file input styling
            />
            {preview && (
              <img
                src={preview}
                alt="Image Preview"
                className="mt-6 rounded-lg max-h-72 object-contain mx-auto shadow-md border border-gray-200 dark:border-gray-700" // Added more styling to preview
              />
            )}
          </div>

          <div className="text-center pt-4">
            {" "}
            {/* Added padding top for spacing */}
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 text-white px-10 py-3 text-xl font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out group"
            >
              🚀 Publish Your Blog
              <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Button>
          </div>
        </form>

        {uploadedImageUrl && (
          <div className="mt-12 text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Image Successfully Uploaded!
            </h2>
            <img
              src={uploadedImageUrl}
              alt="Uploaded Blog Post Image"
              className="max-w-full h-auto rounded-lg shadow-xl mx-auto border border-gray-300 dark:border-gray-600 mb-4"
            />
            <p className="text-lg text-gray-600 dark:text-gray-400 break-words mb-2">
              **Image URL:**{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm break-all">
                {uploadedImageUrl}
              </code>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can now reference this URL in your markdown content.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
