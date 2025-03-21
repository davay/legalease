import ChatHeader from '@/components/ChatHeader';
import ChatInstructions from '@/components/ChatInstructions';
import ChatHistory from '@/components/ChatHistory';
import ChatControls from '@/components/ChatControls';
import { Message } from '@/types/chat';
import styled from 'styled-components';

interface ChatbotProps {
  messages: Message[];
  newMessage: string;
  isLoading: boolean;
  showInstructions: boolean;
  setNewMessage: (message: string) => void;
  setShowInstructions: (show: boolean) => void;
  submitNewMessage: () => Promise<void>;
}

export default function Chatbot({
  messages,
  newMessage,
  isLoading,
  showInstructions,
  setNewMessage,
  setShowInstructions,
  submitNewMessage
}: ChatbotProps) {
  return (
    <ChatContainer>
      <ChatHeader 
        toggleInstructions={() => setShowInstructions(!showInstructions)} 
        showInstructions={showInstructions} 
      />
      {showInstructions && <ChatInstructions closeInstructions={() => setShowInstructions(false)} />}
      <ContentWrapper>
        <MainChatSection>
          <ChatHistory 
            messages={messages} 
            isLoading={isLoading} 
            setNewMessage={setNewMessage} 
            submitNewMessage={submitNewMessage} 
          />
          <ChatControls 
            newMessage={newMessage} 
            isLoading={isLoading} 
            setNewMessage={setNewMessage} 
            submitNewMessage={submitNewMessage} 
          />
        </MainChatSection>
      </ContentWrapper>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 1600px;
  min-height: 100vh;
  padding-bottom: 5rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 1rem;
`;

const MainChatSection = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  margin: 0 auto;
  background-color: #D8C79D;
  border-radius: 8px;
  margin-top: 2rem;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

