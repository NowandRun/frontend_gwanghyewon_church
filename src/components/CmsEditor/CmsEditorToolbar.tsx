import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
  Highlighter,
  Table as TableIcon,
  Palette,
  SquareDashedBottom,
} from 'lucide-react';
import { Divider, IconButton, Toolbar } from './CmsEditorStyles';

type Props = {
  editor: Editor;
  onOpenTableModal: () => void;
};

// ✅ 공용 팔레트 색상
const COMMON_COLORS = [
  '#000000',
  '#111827',
  '#374151',
  '#6b7280',
  '#9ca3af',
  '#d1d5db',
  '#e5e7eb',
  '#f3f4f6',
  '#ffffff',

  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
];

// ✅ 컬러 팔레트 Popover 컴포넌트
const ColorPickerPopover = ({
  icon,
  value,
  onChange,
  title,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (color: string) => void;
  title?: string;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.color-popover-wrapper')) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      className="color-popover-wrapper"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <IconButton
        type="button"
        title={title}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {icon}

        {/* ✅ 현재 색상 미리보기 */}
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '4px',
            background: value,
            border: '1px solid #d1d5db',
          }}
        />
      </IconButton>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            zIndex: 9999,
            width: '220px',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
          }}
        >
          {/* Quick Palette */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '6px',
            }}
          >
            {COMMON_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '6px',
                  background: c,
                  border: c === value ? '2px solid #111827' : '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* 현재 선택된 HEX */}
          <div
            style={{
              marginTop: '10px',
              fontSize: '12px',
              color: '#374151',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>선택 색상</span>
            <span style={{ fontWeight: 600 }}>{value.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function CmsEditorToolbar({ editor, onOpenTableModal }: Props) {
  const [fontSize, setFontSize] = useState('12');

  // ✅ 텍스트 색상 state
  const [textColor, setTextColor] = useState('#111827');

  // ✅ 형광펜 state
  const [highlightColor, setHighlightColor] = useState('#fff59d');

  // ✅ 셀 배경색 state
  const [cellBgColor, setCellBgColor] = useState('#ffffff');

  // ✅ 셀 border 관련 state
  const [cellBorderColor, setCellBorderColor] = useState('#111827');
  const [cellBorderWidth, setCellBorderWidth] = useState(1);
  const [cellBorderStyle, setCellBorderStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');

  useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const current = editor.getAttributes('textStyle').fontSize;
      if (current) setFontSize(current);
    };

    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontSize(value);

    if (!value) return;

    editor.chain().focus().setFontSize(value).run();
  };

  // ✅ 선택된 셀 배경 적용 함수
  const applyCellBackground = (color: string) => {
    if (!editor) return;

    if (!editor.isActive('table')) {
      alert('표 안에서 셀을 선택한 뒤 사용하세요.');
      return;
    }

    editor.chain().focus().setCellAttribute('backgroundColor', color).run();
  };

  // ✅ 선택된 셀 배경 제거
  const clearCellBackground = () => {
    if (!editor) return;

    if (!editor.isActive('table')) {
      alert('표 안에서 셀을 선택한 뒤 사용하세요.');
      return;
    }

    editor.chain().focus().setCellAttribute('backgroundColor', '#ffffff').run();
  };

  // ✅ 선택된 셀 border 스타일 적용
  const applyCellBorder = () => {
    if (!editor) return;

    if (!editor.isActive('table')) {
      alert('표 안에서 셀을 선택한 뒤 사용하세요.');
      return;
    }

    editor
      .chain()
      .focus()
      .setCellAttribute('borderColor', cellBorderColor)
      .setCellAttribute('borderWidth', cellBorderWidth)
      .setCellAttribute('borderStyle', cellBorderStyle)
      .run();
  };

  // ✅ 선택된 셀 border 제거 (점선으로 표시)
  const clearCellBorder = () => {
    if (!editor) return;

    if (!editor.isActive('table')) {
      alert('표 안에서 셀을 선택한 뒤 사용하세요.');
      return;
    }

    editor
      .chain()
      .focus()
      .setCellAttribute('borderStyle', 'dashed')
      .setCellAttribute('borderWidth', 1)
      .setCellAttribute('borderColor', '#cbd5e1')
      .run();
  };

  const SectionLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: 700,
          color: '#374151',
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  return (
    <>
      {/* ==========================
        ✅ 상단 Toolbar (텍스트 편집)
    ========================== */}
      <Toolbar>
        <SectionLabel
          icon={<PaintBucket size={14} />}
          text="텍스트 편집"
        />

        <IconButton
          $active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </IconButton>
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

        <input
          type="number"
          min={1}
          value={fontSize}
          onChange={handleFontSizeChange}
          style={{ width: '60px' }}
        />
        <span>pt</span>

        <Divider />

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

        {/* ✅ 텍스트 색상 */}
        <ColorPickerPopover
          icon={<PaintBucket size={16} />}
          value={textColor}
          title="텍스트 색상"
          onChange={(color) => {
            setTextColor(color);
            editor.chain().focus().setColor(color).run();
          }}
        />

        <Divider />

        {/* ✅ 형광펜 */}
        <ColorPickerPopover
          icon={<Highlighter size={16} />}
          value={highlightColor}
          title="형광펜 (색상 선택 + 적용)"
          onChange={(color) => {
            setHighlightColor(color);
            editor.chain().focus().setHighlight({ color }).run();
          }}
        />
      </Toolbar>
      {/* ==========================
        ✅ 하단 Toolbar (표 기능)
    ========================== */}
      <Toolbar>
        <SectionLabel
          icon={<TableIcon size={14} />}
          text="표 스타일"
        />

        {/* ✅ 표 생성 버튼 */}
        <IconButton
          onClick={onOpenTableModal}
          title="표 추가"
        >
          <TableIcon size={16} />
        </IconButton>

        <Divider />

        {/* ✅ 셀 배경색 */}
        <ColorPickerPopover
          icon={<Palette size={16} />}
          value={cellBgColor}
          title="셀 배경색"
          onChange={(color) => {
            setCellBgColor(color);
            applyCellBackground(color);
          }}
        />

        <IconButton
          onClick={clearCellBackground}
          title="선택한 셀 배경 제거"
        >
          제거
        </IconButton>

        <Divider />

        {/* ✅ 셀 테두리 색상 */}
        <ColorPickerPopover
          icon={<SquareDashedBottom size={16} />}
          value={cellBorderColor}
          title="셀 테두리 색상"
          onChange={(color) => {
            setCellBorderColor(color);
            editor.chain().focus().setCellAttribute('borderColor', color).run();
          }}
        />

        {/* 테두리 굵기 */}
        <input
          type="number"
          min={1}
          max={10}
          value={cellBorderWidth}
          onChange={(e) => setCellBorderWidth(Number(e.target.value))}
          style={{ width: '55px' }}
          title="선택한 셀 테두리 굵기(px)"
        />
        <span>px</span>

        {/* 테두리 스타일 */}
        <select
          value={cellBorderStyle}
          onChange={(e) => setCellBorderStyle(e.target.value as any)}
          style={{
            padding: '4px 6px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '12px',
          }}
          title="선택한 셀 테두리 스타일"
        >
          <option value="solid">실선</option>
          <option value="dashed">점선</option>
          <option value="dotted">도트</option>
        </select>

        <IconButton
          onClick={applyCellBorder}
          title="선택한 셀 테두리 적용"
        >
          적용
        </IconButton>

        <IconButton
          onClick={clearCellBorder}
          title="선택한 셀 테두리 제거(점선)"
        >
          제거
        </IconButton>
      </Toolbar>
    </>
  );
}
