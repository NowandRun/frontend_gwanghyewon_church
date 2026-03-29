import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_MAIN_POPUP_BOARD,
  FIND_ALL_MAIN_POPUP_BOARD_QUERY,
} from '../../../types/grapql_call';

// ✅ GraphQL 결과 구조에 맞게 인터페이스 수정
interface IMainPopupBoard {
  id: number;
  title: string;
  author: string; // Query 결과에 포함되어야 함 (현재 findAll 쿼리에는 없으므로 백엔드 확인 필요)
  createdAt: string;
  blocks: {
    landscape: {
      url: string;
    };
    portrait: {
      url: string;
    };
  };
}

interface IGetMainPopupBoardData {
  findAllMainPopupBoard: {
    ok: boolean;
    error?: string;
    results: IMainPopupBoard[];
    totalPages: number;
    totalResults: number;
  };
}

function MainPopupBoard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const itemsPerPage = 12;

  const { data, loading, refetch } = useQuery<IGetMainPopupBoardData>(
    FIND_ALL_MAIN_POPUP_BOARD_QUERY,
    {
      variables: {
        input: {
          page: currentPage,
          take: itemsPerPage,
          search: searchKeyword,
        },
      },
      fetchPolicy: 'network-only',
    },
  );

  // ✅ 삭제 뮤테이션 결과 처리 필드명 수정 (deleteMainPopupBoard)
  const [deleteMainPopupBoardMutation, { loading: isDeleting }] = useMutation(
    DELETE_MAIN_POPUP_BOARD,
    {
      onCompleted: (data) => {
        if (data.deleteMainPopupBoard.ok) {
          alert('성공적으로 삭제되었습니다.');
          setSelectedIds([]);
          refetch();
        } else {
          alert(`삭제 실패: ${data.deleteMainPopupBoard.error}`);
        }
      },
    },
  );

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      deleteMainPopupBoardMutation({
        variables: {
          input: { ids: selectedIds },
        },
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchKeyword('');
    setCurrentPage(1);
  };

  if (loading && !data) return <Container>데이터를 불러오는 중입니다...</Container>;

  const response = data?.findAllMainPopupBoard;
  const boards = response?.results || [];
  const totalPages = response?.totalPages || 1;
  const totalResults = response?.totalResults || 0;

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
          <h2>메인팝업 관리</h2>
          <p>
            전체 항목: {totalResults}개 | 선택됨: {selectedIds.length}개
          </p>
        </div>
        <SearchWrapper onSubmit={handleSearch}>
          <SearchInput
            placeholder="제목 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <SearchButton type="submit">검색</SearchButton>
          {searchKeyword && (
            <ResetButton
              type="button"
              onClick={handleReset}
            >
              초기화
            </ResetButton>
          )}
        </SearchWrapper>

        <ButtonGroup>
          <DeleteButton
            disabled={selectedIds.length === 0 || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? '삭제 중...' : '선택 삭제'}
          </DeleteButton>
          <WriteButton onClick={() => navigate('/admin/main-popup/create')}>새 글 작성</WriteButton>
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
              <th style={{ width: '100px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board, index) => {
              const displayNum = totalResults - ((currentPage - 1) * itemsPerPage + index);

              // ✅ 썸네일 경로 수정: blocks.landscape.url 사용
              const landscapeThumb = board.blocks?.landscape?.url;

              return (
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
                  <td className="center">{displayNum}</td>
                  <td className="title-cell">
                    {landscapeThumb && (
                      <SmallThumb
                        src={landscapeThumb}
                        alt="landscape_thumb"
                      />
                    )}
                    <span>{board.title}</span>
                  </td>
                  <td className="center">{board.author || '관리자'}</td>
                  <td className="center">
                    {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="center">
                    <EditButton onClick={() => navigate(`/admin/main-popup/edit/${board.id}`)}>
                      수정
                    </EditButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>

        {boards.length === 0 && !loading && (
          <EmptyMsg>{searchKeyword ? `"${searchKeyword}" 결과 없음` : '데이터 없음'}</EmptyMsg>
        )}
      </TableContainer>

      {/* 페이지네이션 생략 (동일) */}
    </Container>
  );
}

export default MainPopupBoard;

const SearchWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  margin-bottom: 2px; /* Header 정렬용 */
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 200px;
  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchButton = styled.button`
  background: #495057;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: #343a40;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #868e96;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: #212529;
  }
`;

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
