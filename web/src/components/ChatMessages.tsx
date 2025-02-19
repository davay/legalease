import Markdown from 'react-markdown';
import useAutoScroll from '@/hooks/useAutoScroll';
import Spinner from '@/components/Spinner';
import userIcon from '@/assets/user.svg';
import errorIcon from '@/assets/error.svg';
import { ChatMessagesProps } from '@/types/chat';
import { RefObject } from 'react';

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollContentRef: RefObject<HTMLDivElement> = useAutoScroll(isLoading);
  return (
    <div ref={scrollContentRef}>
      {messages.map(({ role, content, loading, error }, idx) => (
        <div key={idx}>
          {role === 'user' && (
            <img src={userIcon} alt='user icon' />
          )}
          <div>
            <div>
              {(loading && !content) ? <Spinner />
                : (role === 'assistant')
                  ? <Markdown>{content}</Markdown>
                  : <div>{content}</div>
              }
            </div>
            {error && (
              <div>
                <img src={errorIcon} alt='error icon' />
                <span> Error generating the response</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div >
  );
}
