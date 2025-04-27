import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface TaskInputProps {
  language: 'english' | 'hindi';
  onClose: () => void;
  onSubmit: (task: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ language, onClose, onSubmit }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">
          {language === 'hindi' ? 'नया कार्य जोड़ें' : 'Add New Task'}
        </h3>
        <button 
          type="button" 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder={language === 'hindi' ? 'कार्य विवरण...' : 'Task description...'}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        rows={2}
      />
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
        >
          {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm flex items-center"
        >
          <Check className="h-4 w-4 mr-1" />
          {language === 'hindi' ? 'जोड़ें' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default TaskInput;