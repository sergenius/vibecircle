import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ChatMessage, Conversation, ScheduledHangout } from '@/types';
import { mockConversations, mockHangouts } from '@/data/mockData';

interface ChatState {
  conversations: Conversation[];
  hangouts: ScheduledHangout[];
  activeConversationId?: string;
}

type ChatAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | undefined }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'SCHEDULE_HANGOUT'; payload: ScheduledHangout };

interface ChatContextValue extends ChatState {
  setActiveConversation: (id?: string) => void;
  sendMessage: (conversationId: string, message: ChatMessage) => void;
  scheduleHangout: (hangout: ScheduledHangout) => void;
}

const initialState: ChatState = {
  conversations: mockConversations,
  hangouts: mockHangouts,
  activeConversationId: mockConversations[0]?.id,
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.payload.conversationId
            ? {
                ...conversation,
                lastMessage: action.payload.message,
                unreadCount: 0,
              }
            : conversation,
        ),
      };
    case 'SCHEDULE_HANGOUT':
      return {
        ...state,
        hangouts: [action.payload, ...state.hangouts],
      };
    default:
      return state;
  }
}

export const ChatProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const value = useMemo<ChatContextValue>(() => ({
    ...state,
    setActiveConversation: (id) => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id }),
    sendMessage: (conversationId, message) =>
      dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message } }),
    scheduleHangout: (hangout) => dispatch({ type: 'SCHEDULE_HANGOUT', payload: hangout }),
  }), [state]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
