import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface VoiceInterfaceProps {
  language: 'english' | 'hindi';
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ language }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const { sendMessage } = useChat();

  useEffect(() => {
    const context = new AudioContext();
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    setAudioContext(context);
    setAnalyser(analyserNode);

    return () => {
      context.close();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawWaveform = () => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = 'rgb(249, 250, 251)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = isListening ? 'rgb(239, 68, 68)' : 'rgb(79, 70, 229)';
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  const startListening = async () => {
    if (!audioContext || !analyser) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      drawWaveform();

      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(true);
        sendMessage(transcript, language, false);
        setTimeout(() => {
          setIsProcessing(false);
          setIsListening(false);
        }, 1000);
      };

      recognition.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="mb-8 rounded-lg shadow-lg"
        />
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <Loader className="h-8 w-8 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>
      </div>
      <p className="mt-4 text-lg text-gray-600 text-center">
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
  );
};

export default VoiceInterface;