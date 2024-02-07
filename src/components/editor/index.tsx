"use client";

import { FC } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PlaceHolder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import { ToolBar } from "./tool-bar";

const Tiptap: FC<{ onUpdate: (content: JSONContent) => void }> = ({
  onUpdate,
}) => {
  const editor = useEditor({
    extensions: [
      Link,
      StarterKit,
      PlaceHolder.configure({
        placeholder: "Text (optional)",
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      onUpdate(content);
    },
  });

  return (
    <div>
      <ToolBar editor={editor} />
      <div className="prose prose-stone h-[240px] w-full max-w-full  overflow-y-auto rounded-b-lg border-2 border-divider px-4 dark:prose-invert">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
