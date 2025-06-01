// blog/page.js

import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getUploadedBlogs() {
  const blogsDataFile = path.join(process.cwd(), "data", "blogs.json");
  if (fs.existsSync(blogsDataFile)) {
    const data = fs.readFileSync(blogsDataFile, "utf-8");
    return JSON.parse(data);
  }
  return [];
}

function getMarkdownBlogs() {
  const contentDir = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDir)) return [];

  const dirContent = fs.readdirSync(contentDir, "utf-8");
  return dirContent.map((file) => {
    const fileContent = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(fileContent);
    return { ...data, isMarkdown: true, slug: file.replace(/\.md$/, "") };
  });
}

const Blog = () => {
  const markdownBlogs = getMarkdownBlogs();
  const uploadedBlogs = getUploadedBlogs();
  const allBlogs = [...uploadedBlogs, ...markdownBlogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Our Blogs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allBlogs.map((blog, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 transition-transform duration-300 hover:scale-[1.02] border dark:border-gray-700"
            >
              <div className="h-60 overflow-hidden">
                <img
                  src={blog.image || "/placeholder-image.jpg"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                  {blog.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {blog.description}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>By {blog.author}</span> |{" "}
                  <span>
                    {new Date(blog.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Link
                  href={`/blogpost/${blog.slug}`}
                  className={`${buttonVariants({
                    variant: "outline",
                  })} w-full text-center`}
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
