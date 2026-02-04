import React from 'react';
import { BoardBlock } from '../../../types/types';
import { CmsEditor } from '../../../components/CmsEditor/CmsEditor';

type Props = {
  blocks: BoardBlock[];
  onReplaceImage: (id: string, file: File) => void;
  onRemoveBlock: (id: string) => void;
  onChangeText: (id: string, value: string) => void;
};

export default function BoadBlockEditor({
  blocks,
  onReplaceImage,
  onRemoveBlock,
  onChangeText,
}: Props) {
  return (
    <>
      {blocks.map((block) => {
        if (block.type === 'image') {
          return (
            <div
              key={block.id}
              style={{ position: 'relative' }}
            >
              <img
                src={block.previewUrl}
                style={{ width: '100%' }}
              />
              <button onClick={() => onRemoveBlock(block.id)}>×</button>
            </div>
          );
        }

        if (block.type === 'text') {
          return (
            <CmsEditor
              key={block.id}
              value={block.content}
              onChange={(html: string) => onChangeText(block.id, html)}
            />
          );
        }

        return null;
      })}
    </>
  );
}
