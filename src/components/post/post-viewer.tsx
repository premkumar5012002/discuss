"use client";

import { FC, useMemo } from "react";
import { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export const PostViewer: FC<{ content: JSONContent }> = ({ content }) => {
  const output = useMemo(() => {
    return generateHTML(content, [StarterKit, Link]);
  }, [content]);

  return (
    <div
      className="prose prose-stone w-full max-w-full dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
};
