import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';
import { CmsEditorToolbar } from './CmsEditorToolbar';
import { Extension, mergeAttributes } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

/* ==========================
   ✅ Table에 class 저장 가능한 CustomTable
========================== */
const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return {
            class: attributes.class,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['tbody', 0]];
  },
});

export function CmsEditor({ value, onChange }: Props) {
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [openTableModal, setOpenTableModal] = useState(false);

  const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
      return {
        types: ['textStyle'],
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) => element.style.fontSize?.replace('pt', ''),
              renderHTML: (attributes) => {
                if (!attributes.fontSize) return {};
                return {
                  style: `font-size: ${attributes.fontSize}pt`,
                };
              },
            },
          },
        },
      ];
    },
    addCommands() {
      return {
        setFontSize:
          (size: string) =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontSize: size }).run();
          },
        unsetFontSize:
          () =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
          },
      };
    },
  });

  const CustomTableCell = TableCell.extend({
    addAttributes() {
      return {
        ...this.parent?.(),

        backgroundColor: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-bgcolor'),
          renderHTML: (attributes) => {
            if (!attributes.backgroundColor) return {};
            return {
              'data-bgcolor': attributes.backgroundColor,
            };
          },
        },

        borderColor: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-bordercolor'),
          renderHTML: (attributes) => {
            if (!attributes.borderColor) return {};
            return {
              'data-bordercolor': attributes.borderColor,
            };
          },
        },

        borderWidth: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-borderwidth'),
          renderHTML: (attributes) => {
            if (!attributes.borderWidth) return {};
            return {
              'data-borderwidth': attributes.borderWidth,
            };
          },
        },

        borderStyle: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-borderstyle'),
          renderHTML: (attributes) => {
            if (!attributes.borderStyle) return {};
            return {
              'data-borderstyle': attributes.borderStyle,
            };
          },
        },
      };
    },

    renderHTML({ HTMLAttributes }) {
      const styleList: string[] = [];

      if (HTMLAttributes['data-bgcolor']) {
        styleList.push(`background-color: ${HTMLAttributes['data-bgcolor']}`);
      }

      if (HTMLAttributes['data-bordercolor']) {
        styleList.push(`border-color: ${HTMLAttributes['data-bordercolor']}`);
      }

      if (HTMLAttributes['data-borderwidth']) {
        styleList.push(`border-width: ${HTMLAttributes['data-borderwidth']}px`);
      }

      if (HTMLAttributes['data-borderstyle']) {
        styleList.push(`border-style: ${HTMLAttributes['data-borderstyle']}`);
      }

      if (styleList.length > 0) {
        HTMLAttributes.style = `${HTMLAttributes.style || ''}; ${styleList.join('; ')}`;
      }

      return ['td', HTMLAttributes, 0];
    },
  });

  const CustomTableHeader = TableHeader.extend({
    addAttributes() {
      return {
        ...this.parent?.(),

        backgroundColor: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-bgcolor'),
          renderHTML: (attributes) => {
            if (!attributes.backgroundColor) return {};
            return {
              'data-bgcolor': attributes.backgroundColor,
            };
          },
        },

        borderColor: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-bordercolor'),
          renderHTML: (attributes) => {
            if (!attributes.borderColor) return {};
            return {
              'data-bordercolor': attributes.borderColor,
            };
          },
        },

        borderWidth: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-borderwidth'),
          renderHTML: (attributes) => {
            if (!attributes.borderWidth) return {};
            return {
              'data-borderwidth': attributes.borderWidth,
            };
          },
        },

        borderStyle: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-borderstyle'),
          renderHTML: (attributes) => {
            if (!attributes.borderStyle) return {};
            return {
              'data-borderstyle': attributes.borderStyle,
            };
          },
        },
      };
    },

    renderHTML({ HTMLAttributes }) {
      const styleList: string[] = [];

      if (HTMLAttributes['data-bgcolor']) {
        styleList.push(`background-color: ${HTMLAttributes['data-bgcolor']}`);
      }

      if (HTMLAttributes['data-bordercolor']) {
        styleList.push(`border-color: ${HTMLAttributes['data-bordercolor']}`);
      }

      if (HTMLAttributes['data-borderwidth']) {
        styleList.push(`border-width: ${HTMLAttributes['data-borderwidth']}px`);
      }

      if (HTMLAttributes['data-borderstyle']) {
        styleList.push(`border-style: ${HTMLAttributes['data-borderstyle']}`);
      }

      if (styleList.length > 0) {
        HTMLAttributes.style = `${HTMLAttributes.style || ''}; ${styleList.join('; ')}`;
      }

      return ['th', HTMLAttributes, 0];
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

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

      CustomTable.configure({
        allowTableNodeSelection: true,
        resizable: true,
      }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  /* ==========================
     ✅ 표 생성 시 class 저장
  ========================== */
  const insertCustomTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: false,
      })
      .run();
  };

  return (
    <Wrapper>
      <CmsEditorToolbar
        editor={editor}
        onOpenTableModal={() => setOpenTableModal(true)}
      />

      <EditorContent editor={editor} />

      {openTableModal && (
        <TableModalOverlay>
          <TableModalBox>
            <h3>표 생성</h3>

            <TableModalGrid>
              <label>
                행
                <input
                  type="number"
                  min={1}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                />
              </label>

              <label>
                열
                <input
                  type="number"
                  min={1}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                />
              </label>
            </TableModalGrid>

            <TableModalButtons>
              <ModalCancelButton onClick={() => setOpenTableModal(false)}>취소</ModalCancelButton>

              <ModalCreateButton
                onClick={() => {
                  insertCustomTable({
                    rows: tableRows,
                    cols: tableCols,
                  });
                  setOpenTableModal(false);
                }}
              >
                표 생성
              </ModalCreateButton>
            </TableModalButtons>
          </TableModalBox>
        </TableModalOverlay>
      )}
    </Wrapper>
  );
}

/* ==========================
   styled-components
========================== */
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
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    table-layout: fixed;
  }

  table th,
  table td {
    border: 1px solid #e5e7eb;
  }

  table th[style*='border'],
  table td[style*='border'] {
    border-color: inherit;
    border-style: inherit;
    border-width: inherit;
  }

  .ProseMirror td.selectedCell,
  .ProseMirror th.selectedCell {
    background: rgba(37, 99, 235, 0.18) !important;
  }

  .ProseMirror td.selectedCell::after,
  .ProseMirror th.selectedCell::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid #2563eb;
    pointer-events: none;
    border-radius: 2px;
  }

  table.cms-border-thin th,
  table.cms-border-thin td {
    border: 1px solid #e5e7eb;
  }

  table.cms-border-thick th,
  table.cms-border-thick td {
    border: 2px solid #111827;
  }

  table.cms-border-none th,
  table.cms-border-none td {
    border: none;
    outline: 1px dashed rgba(148, 163, 184, 0.6);
    outline-offset: -1px;
  }

  table.cms-default th {
    font-weight: 600;
    color: #111827;
    background: #f3f4f6;
  }

  table.cms-gray th {
    font-weight: 700;
    color: #111827;
    background: #e5e7eb;
  }

  table.cms-blue th {
    font-weight: 700;
    color: white;
    background: #2563eb;
  }

  .ProseMirror .tableWrapper {
    overflow-x: auto;
  }
`;

const TableModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const TableModalBox = styled.div`
  width: 520px;
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);

  h3 {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 16px;
    color: #111827;
  }
`;

const TableModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  label {
    font-size: 12px;
    color: #374151;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  input[type='number'],
  select {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 13px;
    outline: none;
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin-top: 6px;
  }
`;

const TableModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ModalCancelButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: white;
  font-weight: 700;
  cursor: pointer;
`;

const ModalCreateButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 800;
  cursor: pointer;
`;
