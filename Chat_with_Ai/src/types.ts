export interface Task {
  id: string;
  description: string;
  createdAt: string | Date;
  completed: boolean;
}

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  tasks?: Task[];
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}