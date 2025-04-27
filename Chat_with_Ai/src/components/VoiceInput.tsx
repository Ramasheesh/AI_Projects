import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader, X } from 'lucide-react';
import { pipeline } from '@xenova/transformers';

interface VoiceInputProps {
  language: 'english' | 'hindi';
  onTranscript: (text: string) => void;
  onClose: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ language, onTranscript, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsLoading(true);
        
        try {
          const classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
          const result = await classifier(transcript);
          onTranscript(transcript);
        } catch (error) {
          console.error('Error processing voice input:', error);
          onTranscript(transcript);
        } finally {
          setIsLoading(false);
          setIsListening(false);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsLoading(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening]);

  if (!recognition) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg text-white bg-gradient-to-r from-[#390099] via-red-500 to-green-500 ...">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {language === 'hindi' ? 'बोलकर बताएं' : 'Voice Input'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`p-8 rounded-full transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <Loader className="h-8 w-8 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>
        <p className="mt-4 text-sm text-white">
          {isProcessing
            ? language === 'hindi'
              ? 'आवाज़ को प्रोसेस किया जा रहा है...'
              : 'Processing voice input...'
            : isListening
            ? language === 'hindi'
              ? 'सुन रहा हूं...'
              : 'Listening...'
            : language === 'hindi'
            ? 'बोलने के लिए माइक पर क्लिक करें'
            : 'Click the mic to start speaking'}
        </p>
      </div>
    </div>
  );
};

export default VoiceInput;