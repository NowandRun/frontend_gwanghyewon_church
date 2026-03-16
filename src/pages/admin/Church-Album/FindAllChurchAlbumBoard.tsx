import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_CHURCH_ALBUM_BOARD,
  FIND_ALL_CHURCH_ALBUM_BOARD_QUERY,
} from '../../../types/grapql_call';

interface IChurchAlbumBoard {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

interface IGetChurchAlbumBoardData {
  findAllChurchAlbumBoard: {
    ok: boolean;
    error?: string;
    results: IChurchAlbumBoard[];
    totalPages: number;
    totalResults: number;
  };
}

function ChurchAlbumBoard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const itemsPerPage = 9;

  // 1. 쿼리 선언 (중복 제거됨)
  const { data, loading, error, refetch } = useQuery<IGetChurchAlbumBoardData>(
    FIND_ALL_CHURCH_ALBUM_BOARD_QUERY,
    {
      variables: {
        input: { page: currentPage, take: itemsPerPage },
      },
      fetchPolicy: 'network-only',
    },
  );

  // 2. 삭제 뮤테이션 선언 (딱 한 번만 선언!)
  const [deleteChurchAlbumBoardMutation, { loading: isDeleting }] = useMutation(
    DELETE_CHURCH_ALBUM_BOARD,
    {
      onCompleted: (data) => {
        if (data.deleteChurchAlbumBoard.ok) {
          alert('성공적으로 삭제되었습니다.');
          setSelectedIds([]);
          refetch();
        } else {
          alert(`삭제 실패: ${data.deleteChurchAlbumBoard.error}`);
        }
      },
    },
  );

  // 3. 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      deleteChurchAlbumBoardMutation({
        variables: {
          input: { ids: selectedIds },
        },
      });
    }
  };

  // --- 로직 처리부 ---
  if (loading && !data) return <Container>데이터를 불러오는 중입니다...</Container>;
  if (error) return <Container>에러가 발생했습니다: {error.message}</Container>;

  const response = data?.findAllChurchAlbumBoard;
  const boards = response?.results || [];

  // ✅ 백엔드에서 계산해서 보내주는 totalPages 사용
  const totalPages = response?.totalPages || 1;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === boards.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(boards.map((b) => b.id));
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h2>교우동정 관리</h2>
          <p>선택된 항목: {selectedIds.length}개</p>
        </div>
        <ButtonGroup>
          <DeleteButton
            disabled={selectedIds.length === 0 || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? '삭제 중...' : '선택 삭제'}
          </DeleteButton>
          <WriteButton onClick={() => navigate('/admin/church-album/create')}>
            새 글 작성
          </WriteButton>
        </ButtonGroup>
      </Header>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={boards.length > 0 && selectedIds.length === boards.length}
                />
              </th>
              <th style={{ width: '80px' }}>번호</th>
              <th>제목</th>
              <th style={{ width: '120px' }}>작성자</th>
              <th style={{ width: '120px' }}>작성일</th>
              {/* 🚀 "첨부된 파일" th 삭제 */}
              <th style={{ width: '100px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr
                key={board.id}
                className={selectedIds.includes(board.id) ? 'selected' : ''}
              >
                <td className="center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(board.id)}
                    onChange={() => toggleSelect(board.id)}
                  />
                </td>
                <td className="center">{board.id}</td>
                <td className="title-cell">
                  {board.thumbnailUrl && (
                    <SmallThumb
                      src={board.thumbnailUrl}
                      alt="thumb"
                    />
                  )}
                  <span>{board.title}</span>
                </td>
                <td className="center">{board.author}</td>
                <td className="center">{new Date(board.createdAt).toLocaleDateString()}</td>
                {/* 🚀 "첨부된 파일" td (FileStatusBadge 등) 삭제 */}
                <td className="center">
                  <EditButton onClick={() => navigate(`/admin/church-album/edit/${board.id}`)}>
                    수정
                  </EditButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {boards.length > 0 && totalPages > 1 && (
        <Pagination>
          <PageBtn
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            &lt;
          </PageBtn>

          {[...Array(totalPages)].map((_, i) => (
            <PageNum
              key={i}
              $active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageNum>
          ))}

          <PageBtn
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            &gt;
          </PageBtn>
        </Pagination>
      )}

      {boards.length === 0 && !loading && <EmptyMsg>등록된 데이터가 없습니다.</EmptyMsg>}
    </Container>
  );
}

export default ChurchAlbumBoard;

// (이하 스타일드 컴포넌트 정의는 기존과 동일하게 유지)
const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  p {
    font-size: 13px;
    color: #2f80ed;
    margin-top: 4px;
    font-weight: 600;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;
const WriteButton = styled.button`
  padding: 10px 18px;
  background: #2f80ed;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;
const DeleteButton = styled(WriteButton)`
  background: #fff;
  color: #eb5757;
  border: 1px solid #eb5757;
  &:hover {
    background: #fff5f5;
    opacity: 1;
  }
  &:disabled {
    border-color: #eee;
    color: #ccc;
    cursor: not-allowed;
  }
`;
const EditButton = styled.button`
  padding: 4px 10px;
  background: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`;
const TableContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 8px;
  border-top: 2px solid #333;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background: #f8f9fa;
    padding: 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    transition: background 0.2s;
  }
  tr.selected td {
    background: #f0f7ff;
  }
  .center {
    text-align: center;
  }
  .title-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;
const SmallThumb = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
`;
const EmptyMsg = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #999;
`;

// --- 추가된 스타일드 컴포넌트 ---
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
`;

const PageBtn = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const PageNum = styled.button<{ $active: boolean }>`
  padding: 5px 10px;
  border: 1px solid ${(props) => (props.$active ? '#2f80ed' : '#ddd')};
  background: ${(props) => (props.$active ? '#2f80ed' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: ${(props) => (props.$active ? '#2f80ed' : '#f8f9fa')};
  }
`;
