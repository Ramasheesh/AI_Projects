import React from 'react';
import { MessageSquare, Globe, Mic } from 'lucide-react';

interface HeaderProps {
  language: 'english' | 'hindi';
  mode: 'chat' | 'talk';
  onToggleLanguage: () => void;
  onToggleMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, mode, onToggleLanguage, onToggleMode }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-blue-400 to-pink-400 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {mode === 'chat' ? (
            <MessageSquare className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
          <h1 className="text-xl font-bold">
            {language === 'english' 
              ? (mode === 'chat' ? 'Chat with AI' : 'Talk with AI')
              : (mode === 'chat' ? 'AI से चैट करें' : 'AI से बात करें')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleMode}
            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-colors duration-200"
          >
            {mode === 'chat' ? <Mic className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            <span className="text-sm">
              {language === 'english'
                ? (mode === 'chat' ? 'Switch to Talk' : 'Switch to Chat')
                : (mode === 'chat' ? 'वार्तालाप में जाएं' : 'चैट में जाएं')}
            </span>
          </button>
          
          <button 
            onClick={onToggleLanguage}
            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-colors duration-200"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm">
              {language === 'english' ? 'हिंदी' : 'English'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;