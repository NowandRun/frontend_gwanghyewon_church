import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { BoardBlock, BoardType } from '../../../types/types';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import {
  EDIT_CHURCH_INFORMATION_BOARD_MUTATION,
  FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';
import ChurchInformationBlockToolbar from 'src/components/AdminComponents/ChurchInformationBlockToolbar';
import { useMe } from 'src/hooks/useMe';

export default function EditChurchInformationBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();

  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [author, setAuthor] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: boardData, loading: boardLoading } = useQuery(
    FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
    { variables: { id: Number(id) }, skip: !id },
  );

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_CHURCH_INFORMATION_BOARD_MUTATION);

  useEffect(() => {
    if (meLoading || boardLoading || !boardData?.findChurchInformationBoardById?.ok) return;
    const board = boardData.findChurchInformationBoardById.result;

    setTitle(board.title || '');
    setIsPinned(board.isPinned || false);
    setAuthor(board.author || '');
    setFileUrls(board.fileUrls || []);

    if (board.blocks) {
      setBlocks(
        board.blocks.map((b: any) => ({
          id: uuid(),
          type: b.type.toLowerCase(),
          selected: false,
          content: b.content,
          previewUrl: b.url,
          fileName: b.url?.split('/').pop() || 'file',
        })),
      );
    }
  }, [boardData, boardLoading, meLoading]);

  const getSafeFileData = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '-');
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;
    if (forbiddenChars.test(safeName))
      return { safeName, isValid: false, message: '파일명 특수문자 제한' };
    return { safeName, isValid: true };
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const { safeName } = getSafeFileData(file);
    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(safeName));
    formData.append('boardType', BoardType.CHURCH_BULLETIN);

    const response = await fetch('http://localhost:4000/uploads/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('업로드 실패');
    const data = await response.json();
    return data.url;
  };

  /* 🚀 추가된 핸들러: 체크박스 선택 토글 */
  const toggleSelectBlock = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, selected: !block.selected } : block)),
    );
  };

  /* 🚀 추가된 핸들러: 선택된 블록들 삭제 */
  const removeSelectedBlocks = () => {
    setBlocks((prev) => {
      prev.forEach((block) => {
        if (block.selected && block.type === 'image' && block.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(block.previewUrl);
        }
      });
      return prev.filter((block) => !block.selected);
    });
  };

  const onSubmit = async () => {
    try {
      setUploading(true);
      const finalBlocks = await Promise.all(
        blocks.map(async (b) => {
          if (b.type === 'text') return { type: 'TEXT', content: b.content };
          const url = b.file ? await uploadFileToS3(b.file) : b.previewUrl;
          return { type: 'IMAGE', url };
        }),
      );

      const result = await editBoard({
        variables: {
          input: {
            id: Number(id),
            title: title.trim(),
            isPinned,
            blocks: finalBlocks,
            fileUrls: fileUrls,
          },
        },
      });

      if (result.data?.editChurchInformationBoard.ok) {
        alert('수정되었습니다.');
        navigate('/admin/church-info');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  if (boardLoading || meLoading) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <HeaderArea>
        <h2>게시글 수정</h2>
        <HeaderToolRow>
          <AuthorBox>
            작성자: <strong>{author}</strong>
          </AuthorBox>
          <PinOption>
            <input
              type="checkbox"
              id="isPinnedEdit"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <label htmlFor="isPinnedEdit">📌 중요 공지로 상단 고정</label>
          </PinOption>
        </HeaderToolRow>
      </HeaderArea>

      <TwoColumnLayout>
        <EditorSection>
          <EditorInput
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="제목"
          />
          <BoadBlockEditor
            blocks={blocks}
            onRemoveBlock={(id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
            onChangeText={(id, txt) =>
              setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: txt } : b)))
            }
            onReorder={(a, o) => {
              const oldIdx = blocks.findIndex((b) => b.id === a);
              const newIdx = blocks.findIndex((b) => b.id === o);
              setBlocks(arrayMove(blocks, oldIdx, newIdx));
            }}
            onReplaceImage={(id, files) => {
              const file = (files as FileList)[0];
              if (!file) return;
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === id ? { ...b, file, previewUrl: URL.createObjectURL(file) } : b,
                ),
              );
            }}
            /* ✅ 에러 해결: 필수 props 전달 */
            onToggleSelect={toggleSelectBlock}
            onRemoveSelected={removeSelectedBlocks}
          />
          <AttachmentSection>
            <label htmlFor="file-up">📎 파일 추가</label>
            <input
              id="file-up"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (!e.target.files) return;
                const urls = await Promise.all(Array.from(e.target.files).map(uploadFileToS3));
                setFileUrls((prev) => [...prev, ...urls]);
              }}
            />
            <FileList>
              {fileUrls.map((url, i) => (
                <FileItem key={i}>
                  <span>{url.split('/').pop()}</span>
                  <button onClick={() => setFileUrls((prev) => prev.filter((_, idx) => idx !== i))}>
                    삭제
                  </button>
                </FileItem>
              ))}
            </FileList>
          </AttachmentSection>
          <ChurchInformationBlockToolbar
            onAddText={() =>
              setBlocks([...blocks, { id: uuid(), type: 'text', content: '', selected: false }])
            }
            onAddImage={(f) => {
              const news = Array.from(f).map((file) => ({
                id: uuid(),
                type: 'image',
                file,
                previewUrl: URL.createObjectURL(file),
                selected: false,
              }));
              setBlocks([...blocks, ...(news as any)]);
            }}
          />
        </EditorSection>

        <PreviewSection>
          {isPinned && <NoticeBadge>공지사항</NoticeBadge>}
          <PreviewTitle>{title || '제목 없음'}</PreviewTitle>
          {blocks.map((b) =>
            b.type === 'image' ? (
              <PreviewImageCard key={b.id}>
                <img
                  src={b.previewUrl}
                  alt=""
                />
              </PreviewImageCard>
            ) : (
              <HtmlContent
                key={b.id}
                dangerouslySetInnerHTML={{ __html: b.content || '' }}
              />
            ),
          )}
        </PreviewSection>
      </TwoColumnLayout>

      <SubmitButton
        onClick={onSubmit}
        disabled={editLoading || uploading}
      >
        수정 완료
      </SubmitButton>
    </Container>
  );
}

// 스타일 정의 (이전과 동일)
const HeaderArea = styled.div`
  margin-bottom: 24px;
`;
const HeaderToolRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const PinOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  input {
    cursor: pointer;
  }
  label {
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
`;
const NoticeBadge = styled.span`
  background: #fee2e2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
`;
const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
`;
const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AttachmentSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  label {
    color: #2f80ed;
    cursor: pointer;
    font-weight: 600;
  }
`;
const FileList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  background: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  button {
    color: #eb5757;
    border: none;
    background: none;
    cursor: pointer;
  }
`;
const PreviewSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const PreviewTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
`;
const PreviewImageCard = styled.div`
  img {
    width: 100%;
    border-radius: 8px;
  }
`;
const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  word-break: break-all;
`;
const SubmitButton = styled.button`
  margin-top: 40px;
  width: 100%;
  height: 52px;
  background: #2f80ed;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:disabled {
    background: #cbd5e1;
  }
`;
const AuthorBox = styled.div`
  font-size: 14px;
  color: #666;
  strong {
    color: #222;
  }
`;
