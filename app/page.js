"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Typed from "typed.js";
import React, { useRef, useEffect, useMemo } from "react";
import Link from "next/link";

import uploads from "../data/blogs.json"; // Renamed to blogs.json as per blog post structure

export default function Home() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Storytelling",
        "Ideas",
        "Creativity",
        "Inspiration",
        "Insights",
      ],
      typeSpeed: 50,
      loop: true,
      backSpeed: 30,
      backDelay: 1500,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const topBlogs = useMemo(() => {
    if (!Array.isArray(uploads)) {
      console.error("blogs.json did not resolve to an array:", uploads);
      return [];
    }
    return [...uploads]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, []);

  return (
    <main>
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 py-15 md:py-18 lg:py-30 flex items-center min-h-[calc(100vh-80px)]">
        {/* Subtle Background Grids/Patterns */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] dark:bg-[url('/grid-dark.svg')] bg-repeat opacity-10 pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight drop-shadow-lg">
            💡 Share Your Ideas with the World
            <br />
            <span ref={el} className="text-blue-600 dark:text-blue-400"></span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Publish your unique blog posts and join our thriving community.
            Connect with like-minded individuals, share your expertise, and find
            inspiration daily.
          </p>
          <Link href="/add-blog" passHref legacyBehavior>
            <Button
              as="a"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all duration-300 ease-in-out group"
            >
              ✍️ Start Your Blog
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Button>
          </Link>
        </div>

        {/* Decorative Wave SVG at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 131.767C198.818 174.966 405.341 180.796 612.923 162.779C820.506 144.762 1018.66 98.4111 1221.75 64.9398C1290.76 53.6934 1359.88 43.1491 1440 32.7486V180H0V131.767Z"
              fill="white"
              className="dark:fill-gray-800 transition-all duration-500"
            />
          </svg>
        </div>
      </section>

      {/* --- Top Blogs Section (Remains the same as last update) --- */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-800 relative z-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
              <span className="text-primary-600 dark:text-primary-400">
                Featured
              </span>{" "}
              Reads
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Dive into our most captivating stories and insightful articles,
              curated just for you.
            </p>
          </div>
          <div className="flex flex-wrap justify-center -m-4">
            {topBlogs.length > 0 ? (
              topBlogs.map((blog) => (
                <div
                  key={blog.slug || blog.id}
                  className="w-full sm:w-1/2 lg:w-1/3 p-4 group"
                >
                  <div className="flex flex-col h-full bg-card dark:bg-card-dark rounded-xl shadow-lg dark:shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl border border-border dark:border-border-dark">
                    <img
                      src={blog.image || "/placeholder-image.jpg"}
                      alt={blog.title || "Blog post image"}
                      className="w-full h-56 object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 leading-snug">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow mb-4 text-base leading-relaxed">
                        {blog.description || "No description available."}
                      </p>
                      <Link
                        href={`/blogpost/${blog.slug}`}
                        className={buttonVariants({
                          variant: "outline",
                          className:
                            "mt-auto w-full px-6 py-3 rounded-lg text-lg font-semibold border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-pink-700 transition-all duration-300 ease-in-out group",
                        })}
                      >
                        Read More
                        <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center w-full py-8 text-lg italic">
                No featured blog posts to display at the moment. Check back
                soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section (Remains the same as last update) --- */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              What Our Readers Say
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Hear from our community of avid readers and contributors
            </p>
          </div>

          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                “This blog is my go-to source for insightful articles. The
                content is always well-researched and inspiring!”
              </p>
              <div className="flex items-center justify-center flex-col">
                <img
                  className="w-16 h-16 rounded-full border-2 border-purple-500 mb-3"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Emily Johnson"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Emily Johnson
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avid Reader & Blogger
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                “Contributing articles here has helped me grow as a writer. The
                supportive community and great feedback make all the
                difference.”
              </p>
              <div className="flex items-center justify-center flex-col">
                <img
                  className="w-16 h-16 rounded-full border-2 border-purple-500 mb-3"
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="David Lee"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  David Lee
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Guest Contributor
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                “I love how diverse the topics are here. There’s always
                something new to learn, and the writing quality is top-notch.”
              </p>
              <div className="flex items-center justify-center flex-col">
                <img
                  className="w-16 h-16 rounded-full border-2 border-purple-500 mb-3"
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Sophia Martinez"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Sophia Martinez
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Regular Reader
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
