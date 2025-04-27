import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Upload, Mic } from 'lucide-react';
import ChatMessage from './ChatMessage';
import DocumentTypeSelector from './DocumentTypeSelector';
import VoiceInput from './VoiceInput';
import FileUpload from './FileUpload';
import { useChat } from '../context/ChatContext';

interface ChatInterfaceProps {
  language: 'english' | 'hindi';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const [message, setMessage] = useState<string>('');
  const [showDocSelector, setShowDocSelector] = useState<boolean>(false);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
  const [showVoiceInput, setShowVoiceInput] = useState<boolean>(false);
  const [documentType, setDocumentType] = useState<'medical' | 'resume' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isTyping } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const contextPrefix = documentType 
        ? `[${documentType.toUpperCase()}] ` 
        : '';
      sendMessage(contextPrefix + message, language, false);
      setMessage('');
    }
  };

  const handleDocumentTypeSelect = (type: 'medical' | 'resume') => {
    setDocumentType(type);
    const initialMessage = type === 'medical'
      ? language === 'hindi'
        ? 'स्वास्थ्य सहायता शुरू की गई'
        : 'Medical assistance initiated'
      : language === 'hindi'
        ? 'रेज़्यूमे सहायता शुरू की गई'
        : 'Resume assistance initiated';
    sendMessage(`[${type.toUpperCase()}] ${initialMessage}`, language, false);
  };

  const handleVoiceInput = (transcript: string) => {
    setMessage(transcript);
    setShowVoiceInput(false);
  };

  const handleFileContent = (content: string) => {
    if (documentType) {
      sendMessage(`[${documentType.toUpperCase()}] Analyzing document content:\n${content}`, language, false);
    } else {
      sendMessage(`Analyzing document content:\n${content}`, language, false);
    }
  };

  const getPlaceholder = () => {
    if (language === 'hindi') {
      if (documentType === 'medical') {
        return 'अपना स्वास्थ्य प्रश्न पूछें...';
      } else if (documentType === 'resume') {
        return 'अपना कैरियर प्रश्न पूछें...';
      }
      return 'कुछ पूछें या दस्तावेज़ प्रकार चुनें...';
    } else {
      if (documentType === 'medical') {
        return 'Ask your health question...';
      } else if (documentType === 'resume') {
        return 'Ask your career question...';
      }
      return 'Ask something or select document type...';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-lg shadow-md">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                {language === 'hindi' 
                  ? 'बातचीत शुरू करने के लिए एक संदेश भेजें' 
                  : 'Send a message to start the conversation'}
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} language={language} />
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      AI
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] animate-pulse">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            {showFileUpload ? (
              <FileUpload 
                language={language}
                onFileContent={handleFileContent}
                onClose={() => setShowFileUpload(false)}
              />
            ) : showVoiceInput ? (
              <VoiceInput 
                language={language}
                onTranscript={handleVoiceInput}
                onClose={() => setShowVoiceInput(false)}
              />
            ) : showDocSelector ? (
              <DocumentTypeSelector 
                language={language}
                onSelect={handleDocumentTypeSelect}
                onClose={() => setShowDocSelector(false)}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowVoiceInput(true)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFileUpload(true)}
                  className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocSelector(true)}
                  className={`p-2 rounded-full text-white transition-colors ${
                    documentType === 'medical' 
                      ? 'bg-red-500 hover:bg-red-600'
                      : documentType === 'resume'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;