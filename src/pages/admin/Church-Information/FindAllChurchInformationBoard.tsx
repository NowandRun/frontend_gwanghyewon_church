import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_CHURCH_INFORMATION_BOARD_MUTATION,
  FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
} from '../../../types/grapql_call';

interface IChurchInformationBoard {
  id: number;
  title: string;
  author: string;
  fileUrls: string[] | null; // 🚀 추가
  createdAt: string;
}

interface IGetChurchInformationBoardData {
  findAllChurchInformationBoard: {
    ok: boolean;
    error?: string;
    results: IChurchInformationBoard[];
    totalPages: number;
    totalResults: number;
  };
}

function ChurchInformationBoard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const itemsPerPage = 9;

  // 1. 쿼리 선언 (중복 제거됨)
  const { data, loading, error, refetch } = useQuery<IGetChurchInformationBoardData>(
    FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
    {
      variables: {
        input: { page: currentPage, take: itemsPerPage },
      },
      fetchPolicy: 'network-only',
    },
  );

  // 2. 삭제 뮤테이션 선언
  const [deleteChurchInformationBoardMutation, { loading: isDeleting }] = useMutation(
    DELETE_CHURCH_INFORMATION_BOARD_MUTATION,
    {
      // 삭제 후 리스트 갱신을 위해 refetchQueries를 쓸 수도 있지만,
      // 현재 페이지 번호를 동적으로 유지하기 위해 onCompleted 내에서 refetch()를 쓰는 것이 더 직관적입니다.
      onCompleted: (data) => {
        const { ok, error } = data.deleteChurchInformationBoard;
        if (ok) {
          alert('성공적으로 삭제되었습니다.');
          setSelectedIds([]);
          refetch(); // 현재 보고 있는 페이지의 목록을 새로고침
        } else {
          alert(`삭제 실패: ${error}`);
        }
      },
    },
  );

  // 3. 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      deleteChurchInformationBoardMutation({
        variables: {
          input: { ids: selectedIds },
        },
      });
    }
  };

  // --- 로직 처리부 ---
  if (loading && !data) return <Container>데이터를 불러오는 중입니다...</Container>;
  if (error) return <Container>에러가 발생했습니다: {error.message}</Container>;

  const response = data?.findAllChurchInformationBoard;
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
          <h2>교회 소식 관리</h2>
          <p>선택된 항목: {selectedIds.length}개</p>
        </div>
        <ButtonGroup>
          <DeleteButton
            disabled={selectedIds.length === 0 || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? '삭제 중...' : '선택 삭제'}
          </DeleteButton>
          <WriteButton onClick={() => navigate('/admin/church-info/create')}>
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
              <th style={{ width: '100px' }}>첨부된 파일</th>
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
                <td className="title-cell">{board.title}</td>
                <td className="center">{board.author}</td>
                <td className="center">{new Date(board.createdAt).toLocaleDateString()}</td>
                <td className="center">
                  <TitleGroup>
                    {/* 🚀 첨부파일 유무를 O, X로 표시 */}
                    <FileStatusBadge>
                      {board.fileUrls && board.fileUrls.length > 0 ? '⭕' : '❌'}
                    </FileStatusBadge>
                  </TitleGroup>
                </td>
                <td className="center">
                  <EditButton onClick={() => navigate(`/admin/church-info/edit/${board.id}`)}>
                    수정
                  </EditButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {/* ✅ 추가: 페이지네이션 UI */}
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

export default ChurchInformationBoard;

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

const EmptyMsg = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #999;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// $hasFile 프롭에 따라 색상이 변경되는 배지
const FileStatusBadge = styled.span`
  font-size: 15px;
`;
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
