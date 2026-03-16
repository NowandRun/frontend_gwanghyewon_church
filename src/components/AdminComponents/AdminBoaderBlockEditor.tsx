import React, { useRef } from 'react';
import styled from 'styled-components';
import { BoardBlock } from '../../types/types';
import { CmsEditor } from '../CmsEditor/CmsEditor';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

type Props = {
  blocks: BoardBlock[];
  onReplaceImage: (id: string, files: FileList | File[]) => void;
  onRemoveBlock: (id: string) => void;
  onChangeText: (id: string, value: string) => void;

  onToggleSelect: (id: string) => void;
  onRemoveSelected: () => void;

  onReorder: (activeId: string, overId: string) => void;
};

export default function AdminBoardBlockEditor({
  blocks,
  onReplaceImage,
  onRemoveBlock,
  onChangeText,
  onToggleSelect,
  onRemoveSelected,
  onReorder,
}: Props) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const selectedCount = blocks.filter((block) => block.selected).length;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    onReorder(String(active.id), String(over.id));
  };

  return (
    <>
      {selectedCount > 0 && (
        <SelectedToolbar>
          <span>{selectedCount}개 선택됨</span>
          <button onClick={onRemoveSelected}>선택 삭제</button>
        </SelectedToolbar>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => {
            if (block.type === 'image') {
              return (
                <SortableImageBlock
                  key={block.id}
                  block={block}
                  fileInputRefs={fileInputRefs}
                  onReplaceImage={onReplaceImage}
                  onRemoveBlock={onRemoveBlock}
                  onToggleSelect={onToggleSelect}
                />
              );
            }

            if (block.type === 'text') {
              return (
                <SortableTextBlock
                  key={block.id}
                  id={block.id}
                  selected={!!block.selected}
                  onToggleSelect={() => onToggleSelect(block.id)}
                  onRemove={() => onRemoveBlock(block.id)}
                >
                  <CmsEditor
                    value={block.content}
                    onChange={(html: string) => onChangeText(block.id, html)}
                  />
                </SortableTextBlock>
              );
            }

            return null;
          })}
        </SortableContext>
      </DndContext>
    </>
  );
}

/* ==============================
   Sortable Image Block Component
============================== */
function SortableImageBlock({
  block,
  fileInputRefs,
  onReplaceImage,
  onRemoveBlock,
  onToggleSelect,
}: {
  block: BoardBlock & { type: 'image' };
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onReplaceImage: (id: string, files: FileList | File[]) => void;
  onRemoveBlock: (id: string) => void;
  onToggleSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          ...transform,
          scaleX: 1,
          scaleY: 1,
        })
      : undefined,
    transition,
  };

  return (
    <ImageWrapper
      ref={setNodeRef}
      style={style}
      $selected={!!block.selected}
    >
      {/* ✅ 상단 헤더 영역 */}
      <ImageHeader
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(block.id);
        }}
      >
        <ImageHeaderLeft>
          <DragHandle
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()} // 드래그 클릭 시 선택 안 되게
          >
            ☰
          </DragHandle>

          <FileName title={block.fileName || 'image'}>{block.fileName || 'image'}</FileName>

          {block.selected && <SelectedBadge>선택됨</SelectedBadge>}
        </ImageHeaderLeft>

        <ButtonGroup>
          <EditButton
            onClick={(e) => {
              e.stopPropagation();
              fileInputRefs.current[block.id]?.click();
            }}
          >
            수정
          </EditButton>

          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onRemoveBlock(block.id);
            }}
          >
            삭제
          </DeleteButton>
        </ButtonGroup>
      </ImageHeader>

      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={(el) => {
          fileInputRefs.current[block.id] = el;
        }}
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;

          onReplaceImage(block.id, files);
          e.target.value = '';
        }}
      />
    </ImageWrapper>
  );
}

/* ==============================
   Sortable Text Wrapper (🔥 수정)
============================== */
function SortableTextBlock({
  id,
  children,
  onRemove,
  selected,
  onToggleSelect,
}: {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          ...transform,
          scaleX: 1,
          scaleY: 1,
        })
      : undefined,
    transition,
  };

  return (
    <TextWrapper
      ref={setNodeRef}
      style={style}
      $selected={selected}
    >
      <TextHeader
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        <TextHeaderLeft>
          <TextDragHandle
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            ☰
          </TextDragHandle>
          <BlockLabel>텍스트 블럭</BlockLabel>
        </TextHeaderLeft>

        <TextDeleteButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          삭제
        </TextDeleteButton>
      </TextHeader>

      <TextContent>{children}</TextContent>
    </TextWrapper>
  );
}
/* ==============================
   Styled Components
============================== */

const SelectedToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 14px;
  border-radius: 10px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  margin-bottom: 14px;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  button {
    border: none;
    cursor: pointer;
    background: #ef4444;
    color: white;
    font-size: 13px;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 8px;

    &:hover {
      background: #dc2626;
    }
  }
`;

const ImageWrapper = styled.div<{ $selected: boolean }>`
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.$selected ? '#2563eb' : '#e5e7eb')};
  background: #ffffff;

  box-shadow: ${(props) => (props.$selected ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none')};

  cursor: pointer;

  will-change: transform;
  transform-origin: 0 0;
`;

const ImageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const ImageHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const DragHandle = styled.div`
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;

  cursor: grab;
  user-select: none;
`;

const FileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;

  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SelectedBadge = styled.div`
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;

  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const BaseButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  transition: 0.15s ease;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;
const EditButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.95);
  color: #111827;

  border: 1px solid #e5e7eb;

  &:hover {
    background: white;
  }
`;

const DeleteButton = styled(BaseButton)`
  background: rgba(239, 68, 68, 0.95);
  color: white;

  &:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

const TextWrapper = styled.div<{ $selected: boolean }>`
  margin-bottom: 14px;
  border-radius: 14px;
  border: 2px solid ${(props) => (props.$selected ? '#2563eb' : '#e5e7eb')};
  background: #ffffff;
  overflow: hidden;

  box-shadow: ${(props) => (props.$selected ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none')};

  cursor: pointer;

  will-change: transform;
  transform-origin: 0 0;
`;

const TextHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TextHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TextDragHandle = styled.div`
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;

  cursor: grab;
  user-select: none;
`;

const BlockLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

const TextDeleteButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;

  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;

  background: rgba(239, 68, 68, 0.95);
  color: white;

  transition: 0.15s ease;

  &:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

const TextContent = styled.div`
  padding: 14px;
`;
