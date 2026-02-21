import { useQuery } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import { FIND_ALL_CHARCH_INFORMATION_BOARD } from '../../../gql/mutations/docs';
import { useNavigate } from 'react-router-dom';
function CharchInformationBoard() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(FIND_ALL_CHARCH_INFORMATION_BOARD);

  if (loading) return <p>로딩중...</p>;

  if (error) {
    console.log(error);
    return <p>에러 발생 😥</p>;
  }

  return (
    <Container>
      <Header>
        <h2>게시판</h2>
        <WriteButton onClick={() => navigate('/admin/charch-info/create')}>글 작성</WriteButton>
      </Header>

      <Grid>
        {data.findAllCharchInformationBoards.map((board: any) => (
          <Card key={board.id}>
            <Thumbnail
              src={board.thumbnailUrl || '/no-image.png'}
              alt={board.title}
            />
            <CardBody>
              <Title>{board.title}</Title>
              <Meta>
                <span>{board.author}</span>
                <span>{new Date(board.createdAt).toLocaleDateString()}</span>
              </Meta>
              {/* 필요하면 blocks 렌더링 */}
              {board.blocks.map((block: any, idx: number) =>
                block.type === 'TEXT' ? (
                  <p key={idx}>{block.content}</p>
                ) : (
                  <img
                    key={idx}
                    src={block.url}
                    alt=""
                  />
                ),
              )}
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default CharchInformationBoard;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const WriteButton = styled.button`
  padding: 10px 16px;
  background: #2f80ed;
  color: white;
  border-radius: 6px;
  font-weight: 600;

  &:hover {
    background: #1c66d6;
  }
`;

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-6px);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #777;
`;
