import React from 'react';
// components/BlockEditor.tsx
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import { BoardBlock } from '../../types/types';

export default function BlockEditor({
  blocks,
  setBlocks,
}: {
  blocks: BoardBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<BoardBlock[]>>;
}) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <TextBlock
              key={block.id}
              block={block}
              onChange={(content) => {
                setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, content } : b)));
              }}
            />
          );
        }

        return (
          <ImageBlock
            key={block.id}
            block={block}
            onRemove={() => setBlocks((prev) => prev.filter((b) => b.id !== block.id))}
          />
        );
      })}
    </>
  );
}
