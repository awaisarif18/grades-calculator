import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function BlogPage() {
  const postsDir = path.join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDir);

  const posts = files
    .map((file) => {
      const source = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(source);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title,
        date: data.date,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-pink-200 min-h-screen py-12">
      <main className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-white mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg p-6 shadow-md transition-opacity"
            >
              <h2 className="text-2xl font-semibold text-indigo-900">
                {p.title}
              </h2>
              <p className="text-sm text-gray-700 mt-2">{p.date}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
