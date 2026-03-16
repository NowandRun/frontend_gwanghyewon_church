import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';
import { CmsEditorToolbar } from './CmsEditorToolbar';
import { Extension } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function CmsEditor({ value, onChange }: Props) {
  // 폰트 사이즈 익스텐션
  const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
      return { types: ['textStyle'] };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) => element.style.fontSize?.replace('pt', ''),
              renderHTML: (attributes) =>
                attributes.fontSize ? { style: `font-size: ${attributes.fontSize}pt` } : {},
            },
          },
        },
      ];
    },
    addCommands() {
      return {
        setFontSize:
          (size: string) =>
          ({ chain }: any) =>
            chain().setMark('textStyle', { fontSize: size }).run(),
        unsetFontSize:
          () =>
          ({ chain }: any) =>
            chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
      } as any;
    },
  });

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Wrapper>
      <CmsEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;

  .ProseMirror {
    padding: 16px;
    min-height: 260px;
    outline: none;
    font-size: 15px;
    line-height: 1.6;

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
  }
`;
