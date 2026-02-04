import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  PaintBucket,
} from 'lucide-react';
import { ColorInput, Divider, IconButton, Toolbar } from './CmsEditorStyles';

type Props = {
  editor: Editor;
  onUploadImage: (file: File) => void;
};

export function CmsEditorToolbar({ editor, onUploadImage }: Props) {
  return (
    <Toolbar>
      {/* Text style */}
      <IconButton
        $active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </IconButton>

      <IconButton
        $active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </IconButton>

      <Divider />

      {/* Heading */}
      <IconButton
        $active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </IconButton>

      <IconButton
        $active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </IconButton>

      <IconButton
        $active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </IconButton>

      <Divider />

      {/* Alignment */}
      <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={16} />
      </IconButton>

      <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={16} />
      </IconButton>

      <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={16} />
      </IconButton>

      <Divider />

      <IconButton as="label">
        <PaintBucket size={16} />
        <input
          type="color"
          hidden
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            editor.chain().focus().setColor(e.target.value).run();
          }}
        />
      </IconButton>

      {/* Table */}
      <IconButton
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={16} />
      </IconButton>
    </Toolbar>
  );
}
