
import { Message } from '@/types/user';

// Archive messages when case is closed
export const archiveCaseMessages = (caseId: string) => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  const updatedMessages = messages.map((msg: Message) => 
    msg.caseId === caseId ? { ...msg, archived: true } : msg
  );
  localStorage.setItem('case_messages', JSON.stringify(updatedMessages));
};

// Get messages for a specific case
export const getCaseMessages = (caseId: string, includeArchived: boolean = false): Message[] => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  return messages.filter((msg: Message) => 
    msg.caseId === caseId && (includeArchived || !msg.archived)
  );
};

// Send message
export const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  localStorage.setItem('case_messages', JSON.stringify(messages));
  return newMessage;
};
