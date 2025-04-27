import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  language: 'english' | 'hindi';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, language }) => {
  const isAi = message.sender === 'ai';
  
  // Process newline characters in the message text
  const formattedText = message.text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex items-start space-x-2 ${isAi ? '' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-gray-100 flex-shrink-0">
          AI
        </div>
      )}
      
      <div 
        className={`p-3 rounded-lg max-w-[80%] ${
          isAi 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-indigo-600 text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{formattedText}</p>
      </div>
      
      {!isAi && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
          {language === 'hindi' ? 'आप' : 'You'}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;