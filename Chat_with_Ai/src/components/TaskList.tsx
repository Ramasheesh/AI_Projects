import React, { useState } from 'react';
import { CheckCircle, Circle, Trash } from 'lucide-react';
import { Task } from '../types';
import { useChat } from '../context/ChatContext';

interface TaskListProps {
  tasks: Task[];
  language: 'english' | 'hindi';
}

const TaskList: React.FC<TaskListProps> = ({ tasks, language }) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const { sendMessage } = useChat();

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleTaskComplete = (taskId: string, taskDesc: string, index: number) => {
    sendMessage(`Complete task ${index + 1}`, language, false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
        {language === 'hindi' ? 'कार्य सूची' : 'Task List'}
      </h2>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">
          {language === 'hindi' ? 'कोई कार्य नहीं' : 'No tasks'}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li 
              key={task.id} 
              className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
              }`}
            >
              <div 
                className="p-3 flex items-start space-x-2 cursor-pointer"
                onClick={() => toggleTaskExpansion(task.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {expandedTask === task.id && !task.completed && (
                <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-end space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskComplete(task.id, task.description, index);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                  >
                    {language === 'hindi' ? 'पूर्ण करें' : 'Complete'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;