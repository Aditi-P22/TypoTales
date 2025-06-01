// blogpost/[slug]/page.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { unified } from "unified";
import OnThisPage from "@/components/onthispage";

export default async function Page({ params }) {
  const slug = params.slug;
  let postData = null;
  let rawContent = null;

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: "github-dark",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3000,
        }),
      ],
    })
    .use(rehypeFormat)
    .use(rehypeStringify);

  // First try JSON data
  const blogsDataFile = path.join(process.cwd(), "data", "blogs.json");
  if (fs.existsSync(blogsDataFile)) {
    const jsonData = fs.readFileSync(blogsDataFile, "utf-8");
    const uploadedBlogs = JSON.parse(jsonData);
    const foundBlog = uploadedBlogs.find((blog) => blog.slug === slug);

    if (foundBlog) {
      postData = foundBlog;
      rawContent = foundBlog.content;
    }
  }

  // Fallback to Markdown file
  if (!postData) {
    const markdownFilePath = path.join(process.cwd(), `content/${slug}.md`);
    if (fs.existsSync(markdownFilePath)) {
      const fileContent = fs.readFileSync(markdownFilePath, "utf-8");
      const { content, data } = matter(fileContent);
      postData = data;
      rawContent = content;
    }
  }

  if (!postData || !rawContent) {
    notFound();
  }

  const htmlContent = (await processor.process(rawContent)).toString();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          {postData.title}
        </h1>

        {postData.description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-6 border-l-4 border-blue-500 pl-4">
            "{postData.description}"
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          {postData.author && (
            <p>
              By <span className="font-medium">{postData.author}</span>
            </p>
          )}
          {postData.date && <p>• {postData.date}</p>}
        </div>

        {postData.image && (
          <img
            src={postData.image}
            alt={postData.title}
            className="w-full h-72 object-cover rounded-lg shadow mb-8"
          />
        )}

        <div
          className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-pre:shadow-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <hr className="my-10 border-gray-300 dark:border-gray-700" />
      </article>
    </div>
  );
}
