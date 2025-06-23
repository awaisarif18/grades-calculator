"use client";

import React from "react";
import { MDXRemote } from "next-mdx-remote-client/rsc";

export default function ClientPost({ mdxSource }) {
  return (
    <article className="prose prose-indigo max-w-none px-6">
      <MDXRemote {...mdxSource} />
    </article>
  );
}
