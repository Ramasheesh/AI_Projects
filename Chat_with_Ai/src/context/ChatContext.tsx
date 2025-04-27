import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, language: 'english' | 'hindi', interviewMode: boolean) => void;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  isTyping: false
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Determine the appropriate websocket URL based on environment
    const isProduction = window.location.hostname !== 'localhost';
    const socketUrl = isProduction 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    // Initialize socket connection
    socketRef.current = io(socketUrl);
    
    // Set up event listeners
    socketRef.current.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });
    
    socketRef.current.on('typing', (status: boolean) => {
      setIsTyping(status);
    });
    
    // Clean up socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (text: string, language: 'english' | 'hindi', interviewMode: boolean) => {
    // Add user message to state
    const userMessage: Message = {
      text,
      sender: 'user',
      tasks: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send message to server
    if (socketRef.current) {
      socketRef.current.emit('message', { 
        message: text, 
        language: language.toLowerCase(), 
        interviewMode 
      });
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};