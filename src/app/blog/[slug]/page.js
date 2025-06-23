import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import Link from "next/link";
import ClientPost from "./ClientPost"; // Regular import of client component

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  return fs
    .readdirSync(postsDir)
    .map((file) => ({ slug: file.replace(/\.mdx?$/, "") }));
}

export default async function PostPage({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "posts", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const mdxSource = await serialize(content, { scope: data });

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-pink-200 min-h-screen py-12">
      <main className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg p-8 shadow-lg">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
          {data.title}
        </h1>
        <p className="text-gray-500 mb-8">{data.date}</p>

        {/* ClientPost is a client component that handles MDXRemote */}
        <ClientPost mdxSource={mdxSource} />

        <div className="mt-8">
          <Link href="/blog" className="text-indigo-900 underline">
            ← Back to blog
          </Link>
        </div>
      </main>
    </div>
  );
}
