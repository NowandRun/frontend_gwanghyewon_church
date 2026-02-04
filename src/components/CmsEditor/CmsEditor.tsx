import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';
import { CmsEditorToolbar } from './CmsEditorToolbar';
import axios from 'axios';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function CmsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'], // ⭐ 필수
      }),
      Color,
      Table.configure({
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const uploadImage = async (file: File) => {
    if (!editor) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('http://localhost:3000/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    editor.chain().focus().setImage({ src: res.data.url }).run();
  };

  if (!editor) return null;

  return (
    <Wrapper>
      <CmsEditorToolbar
        editor={editor}
        onUploadImage={uploadImage}
      />
      <EditorContent editor={editor} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;

  /* 에디터 본문 */
  .ProseMirror {
    padding: 16px;
    min-height: 200px;
    outline: none;
    font-size: 15px;
    line-height: 1.6;
  }

  /* placeholder */
  .ProseMirror p.is-editor-empty:first-child::before {
    content: '내용을 입력하세요…';
    color: #9ca3af;
    float: left;
    height: 0;
    pointer-events: none;
  }

  /* table 기본 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 8px;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
  }

  /* image */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
  }
`;
