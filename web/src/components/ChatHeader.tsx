import styled from 'styled-components';
import BeagleCrest from '@/assets/legalease.svg';

interface Props {
  toggleInstructions: () => void;
  showInstructions: boolean;
}

export default function ChatHeader({ toggleInstructions, showInstructions }: Props) {
  return (
    <Header>
      <TextContainer>
        <Title>Welcome to LegalEase!</Title>
        <Description>
          This free service is provided to support Washington residents who aspire to open a business...
          <br />
          <i>This AI agent is not a legal representative. Any recommendations should not be considered legal advice.</i>
        </Description>
      </TextContainer>
      <Button onClick={toggleInstructions}>
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </Button>
      <Logo src={BeagleCrest} alt="LegalEase Emblem" />
    </Header>
  );
}

// Styled Components
const Header = styled.div`
  padding: 50px 20px;
  background-color: #D8C79D;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px 2px 10px 10px;

  position: sticky;
  top: 0; /* Ensures it sticks to the top */
  z-index: 1000; /* Keeps it above other content */
  height: 4rem; /* Fixed height to prevent shifting */
  flex-shrink: 0; /* Prevents shrinking */
  
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional shadow */
`;



const TextContainer = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 0.875rem;
  line-height: 1.4;
`;

const Button = styled.button`
  background-color: #3E1F1B;
  color: #D8C79D;
  border: 2px solid #D8C79D;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #B82F1A;
  }
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
`;
