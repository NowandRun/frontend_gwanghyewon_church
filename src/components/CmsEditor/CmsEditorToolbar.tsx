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
} from 'lucide-react';
import { Divider, IconButton, Toolbar } from './CmsEditorStyles';

type Props = {
  editor: Editor;
};

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
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {icon}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '6px' }}>
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
        </div>
      )}
    </div>
  );
};

export function CmsEditorToolbar({ editor }: Props) {
  const [fontSize, setFontSize] = useState('12');
  const [textColor, setTextColor] = useState('#111827');
  const [highlightColor, setHighlightColor] = useState('#fff59d');

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontSize(value);
    if (value) editor.chain().focus().setFontSize(value).run();
  };

  const SectionLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
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

  return (
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
        style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db' }}
      />
      <span style={{ fontSize: '12px', marginLeft: '4px' }}>pt</span>
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
      <ColorPickerPopover
        icon={<Highlighter size={16} />}
        value={highlightColor}
        title="형광펜"
        onChange={(color) => {
          setHighlightColor(color);
          editor.chain().focus().setHighlight({ color }).run();
        }}
      />
    </Toolbar>
  );
}
