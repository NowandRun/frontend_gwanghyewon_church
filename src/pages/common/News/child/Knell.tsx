import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs'; // 👈 [해결] TS2304: Cannot find name 'dayjs'

// --- GraphQL 쿼리 ---
const FIND_ALL_BOARDS_QUERY = gql`
  query findAllCharchInformationBoards($input: FindAllCharchInformationBoardsPaginationInput!) {
    findAllCharchInformationBoards(input: $input) {
      ok
      error
      results {
        id
        title
        author
        thumbnailUrl
        createdAt
      }
      totalResults
      totalPages
    }
  }
`;

const FIND_BOARD_BY_ID_QUERY = gql`
  query findCharchInformationBoardById($id: Float!) {
    findCharchInformationBoardById(id: $id) {
      ok
      error
      result {
        id
        title
        author
        blocks
        thumbnailUrl
        createdAt
      }
    }
  }
`;

function Tidings() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page] = useState(1);

  const { data: listData, loading: listLoading } = useQuery(FIND_ALL_BOARDS_QUERY, {
    variables: { input: { page, take: 10 } },
  });

  const { data: detailData, loading: detailLoading } = useQuery(FIND_BOARD_BY_ID_QUERY, {
    variables: { id: selectedId ? parseFloat(selectedId.toString()) : 0 },
    skip: !selectedId,
  });

  if (listLoading) return <Message>로딩 중...</Message>;
  return (
    <Container>
      <TidingsWrapper>
        <TidingsTitle
          onClick={() => setSelectedId(null)}
          style={{ cursor: 'pointer' }}
        >
          교회소식
        </TidingsTitle>
      </TidingsWrapper>

      {!selectedId ? (
        <PostGrid>
          {listData?.findAllCharchInformationBoards.results?.map((post: any) => (
            <PostCard
              key={post.id}
              onClick={() => setSelectedId(post.id)}
            >
              <Thumbnail
                src={post.thumbnailUrl || '/default-thumb.png'}
                alt="thumb"
              />
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostDate>{dayjs(post.createdAt).format('YYYY.MM.DD')}</PostDate>
              </PostInfo>
            </PostCard>
          ))}
        </PostGrid>
      ) : (
        <DetailView>
          {detailLoading ? (
            <Message>게시글을 불러오는 중...</Message>
          ) : (
            <>
              <BackButton onClick={() => setSelectedId(null)}>← 목록으로 돌아가기</BackButton>
              <DetailHeader>
                <h1>{detailData?.findCharchInformationBoardById.result?.title}</h1>
                <p>
                  {dayjs(detailData?.findCharchInformationBoardById.result?.createdAt).format(
                    'YYYY년 MM월 DD일',
                  )}{' '}
                  | {detailData?.findCharchInformationBoardById.result?.author}
                </p>
              </DetailHeader>

              {/* ✅ [수정 핵심] JSON 날것이 아닌 블록 렌더링 로직 적용 */}
              <ContentRender>
                {(() => {
                  const rawBlocks = detailData?.findCharchInformationBoardById.result?.blocks;
                  if (!rawBlocks) return null;

                  // 데이터가 문자열일 경우를 대비해 파싱 처리
                  const parsedBlocks =
                    typeof rawBlocks === 'string' ? JSON.parse(rawBlocks) : rawBlocks;

                  return parsedBlocks.map((block: any, index: number) => {
                    if (block.type === 'TEXT') {
                      return (
                        <HtmlBlock
                          key={index}
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      );
                    }
                    if (block.type === 'IMAGE') {
                      return (
                        <ImageBlock key={index}>
                          <img
                            src={block.url}
                            alt={`content-${index}`}
                          />
                        </ImageBlock>
                      );
                    }
                    return null;
                  });
                })()}
              </ContentRender>
            </>
          )}
        </DetailView>
      )}
    </Container>
  );
}

export default Tidings;

// ... Styled Components는 이전과 동일 (생략)
const Container = styled.div`
  padding-bottom: 200px;
  width: 100%;
`;
const TidingsWrapper = styled.div`
  margin-bottom: 50px;
`;
const TidingsTitle = styled.h2`
  font-size: 2.5vw;
  font-weight: bold;
`;
const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;
const PostCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
  }
`;
const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;
const PostInfo = styled.div`
  padding: 15px;
`;
const PostTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PostDate = styled.span`
  color: #888;
  font-size: 0.9rem;
`;
const DetailView = styled.div`
  /* 기존 padding: 0 20px; 대신 아래처럼 적용하세요 */
  width: 100%;
  box-sizing: border-box;
  /* 목록 페이지의 그리드 아이템이 가지는 내부 여백과 유사한 느낌을 줍니다 */
  padding: 0 10px;
  ${({ theme }) => theme.media.mobile} {
    padding: 0;
  }
`;
const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  margin-bottom: 20px;
`;
const DetailHeader = styled.div`
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
  h1 {
    font-size: 2rem;
  }
  p {
    color: #666;
    margin-top: 10px;
  }
`;
const ContentRender = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const HtmlBlock = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;

  /* 1. 표(Table) 스타일 복구 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    table-layout: fixed;
  }
  th,
  td {
    border: 1px solid #dee2e6;
    padding: 12px;
    min-width: 50px;
    word-break: break-all;
  }
  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  /* 2. Tiptap 에디터에서 적용된 텍스트 정렬 */
  .has-text-align-center {
    text-align: center;
  }
  .has-text-align-right {
    text-align: right;
  }
  .has-text-align-left {
    text-align: left;
  }

  /* 3. 문단 및 타이포그래피 */
  p {
    margin-bottom: 1rem;
  }
  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }

  /* 4. 에디터에서 설정한 인라인 스타일(색상 등) 허용 */
  span[style] {
    display: inline-block;
  }
`;

const ImageBlock = styled.div`
  width: 100%;
  margin: 20px 0;

  img {
    display: block;
    /* ✅ 100% 보다는 약간 작게 설정하여 여백을 확보합니다. */
    height: auto;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;
const Message = styled.div`
  text-align: center;
  padding: 50px;
`;
