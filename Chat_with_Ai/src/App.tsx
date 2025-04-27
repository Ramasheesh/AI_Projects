import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import Header from './components/Header';
import { ChatProvider } from './context/ChatContext';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [mode, setMode] = useState<'chat' | 'talk'>('chat');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
  };

  const toggleMode = () => {
    setMode(prev => prev === 'chat' ? 'talk' : 'chat');
  };

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header 
          language={language} 
          mode={mode}
          onToggleLanguage={toggleLanguage}
          onToggleMode={toggleMode}
        />
        <main className="flex-1 overflow-hidden p-4">
          {mode === 'chat' ? (
            <ChatInterface language={language} />
          ) : (
            <VoiceInterface language={language} />
          )}
        </main>
      </div>
    </ChatProvider>
  );
};

export default App;