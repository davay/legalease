import styled from 'styled-components';
import Spinner from '@/components/Spinner';

interface ContentDisplayProps {
  content: string;
  isLoading: boolean;
  emptyStateMessage?: string;
}

export default function ContentDisplay({ 
  content, 
  isLoading, 
  emptyStateMessage = "No content to display yet." 
}: ContentDisplayProps) {
  return (
    <ContentContainer>
      {content && content.trim() ? (
        <ContentBox>
          <ContentText>{content}</ContentText>
          {isLoading && (
            <LoadingIndicator>
              <Spinner />
            </LoadingIndicator>
          )}
        </ContentBox>
      ) : isLoading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <EmptyState>
          <p>{emptyStateMessage}</p>
        </EmptyState>
      )}
    </ContentContainer>
  );
}

const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  min-height: 200px;
`;


const ContentBox = styled.div`
  width: 100%;
  min-height: 60vh;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentText = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
  font-size: 1rem;
  color: #374151;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  p {
    margin-bottom: 1rem;
    font-weight: 500;
  }
`;
