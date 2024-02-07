import { FC } from "react";
import { Button, cn } from "@nextui-org/react";

import {
  IconBold,
  IconCode,
  IconHeading,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconQuote,
  IconSourceCode,
  IconStrikethrough,
} from "@tabler/icons-react";
import { Editor } from "@tiptap/react";

export const ToolBar: FC<{ editor: Editor | null }> = ({ editor }) => {
  if (editor === null) {
    return null;
  }

  return (
    <div className="flex w-full divide-x divide-divider rounded-t-lg border-x-2 border-t-2 border-divider py-2">
      <div className="space-x-2 px-2">
        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("bold") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleBold().run()}
        >
          <IconBold
            size={20}
            className={cn(
              editor.isActive("bold") ? "text-default-900" : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("italic") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleItalic().run()}
        >
          <IconItalic
            size={20}
            className={cn(
              editor.isActive("italic")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("link") ? "shadow" : "light"}
          onClick={() => {
            const prevUrl = editor.getAttributes("link").href;

            const url = window.prompt("Paste your url...", prevUrl);

            if (url === null) {
              return;
            }

            if (url.length === 0) {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url, target: "_blank" })
              .run();
          }}
        >
          <IconLink
            size={20}
            className={cn(
              editor.isActive("link") ? "text-default-900" : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("strike") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleStrike().run()}
        >
          <IconStrikethrough
            size={20}
            className={cn(
              editor.isActive("strike")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("code") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleCode().run()}
        >
          <IconCode
            size={20}
            className={cn(
              editor.isActive("code") ? "text-default-900" : "text-default-500",
            )}
          />
        </Button>
      </div>

      <div className="space-x-2 px-2">
        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("heading") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleHeading({ level: 2 }).run()}
        >
          <IconHeading
            size={20}
            className={cn(
              editor.isActive("heading")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("bulletList") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleBulletList().run()}
        >
          <IconList
            size={20}
            className={cn(
              editor.isActive("bulletList")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("orderedList") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleOrderedList().run()}
        >
          <IconListNumbers
            size={20}
            className={cn(
              editor.isActive("orderedList")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("blockquote") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleBlockquote().run()}
        >
          <IconQuote
            size={20}
            className={cn(
              editor.isActive("blockquote")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>

        <Button
          size="sm"
          isIconOnly
          variant={editor.isActive("codeBlock") ? "shadow" : "light"}
          onClick={() => editor.chain().toggleCodeBlock().run()}
        >
          <IconSourceCode
            size={20}
            className={cn(
              editor.isActive("codeBlock")
                ? "text-default-900"
                : "text-default-500",
            )}
          />
        </Button>
      </div>
    </div>
  );
};
