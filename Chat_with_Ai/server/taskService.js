// In-memory task storage
const tasks = [];

export const taskService = {
  // Get all tasks
  getTasks() {
    return [...tasks];
  },
  
  // Add a new task
  addTask(task) {
    const newTask = {
      id: Date.now().toString(),
      description: task,
      createdAt: new Date(),
      completed: false
    };
    tasks.push(newTask);
    return newTask;
  },
  
  // Update task status
  updateTask(id, status) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = status;
      return tasks[taskIndex];
    }
    return null;
  },
  
  // Delete a task
  deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      return tasks.splice(taskIndex, 1)[0];
    }
    return null;
  },
  
  // Process task-related commands
  processTaskCommand(message, language) {
    const lowerMessage = message.toLowerCase();
    
    // Add task
    if (lowerMessage.includes('assign task:') || lowerMessage.includes('add task:') || 
        lowerMessage.includes('कार्य जोड़ें:') || lowerMessage.includes('कार्य असाइन करें:')) {
      const taskDesc = message.split(':')[1].trim();
      this.addTask(taskDesc);
      
      return {
        isTaskCommand: true,
        response: language === 'hindi' 
          ? `कार्य जोड़ दिया गया: ${taskDesc}। क्या आप एक अनुस्मारक चाहते हैं?`
          : `Task added: ${taskDesc}. Would you like a reminder?`
      };
    }
    
    // List tasks
    if (lowerMessage.includes('list my tasks') || lowerMessage.includes('show my tasks') || 
        lowerMessage.includes('मेरे कार्य दिखाएं') || lowerMessage.includes('मेरे कार्यों की सूची')) {
      const taskList = this.getTasks();
      
      if (taskList.length === 0) {
        return {
          isTaskCommand: true,
          response: language === 'hindi' 
            ? 'आपके पास कोई कार्य नहीं है। "कार्य जोड़ें:" के साथ एक कार्य जोड़ें।'
            : 'You have no tasks. Add one with "Assign task:".'
        };
      }
      
      const taskListText = language === 'hindi'
        ? 'आपके कार्य:\n' + taskList.map((t, i) => `${i+1}. ${t.description} ${t.completed ? '(पूर्ण)' : '(अपूर्ण)'}`).join('\n')
        : 'Your tasks:\n' + taskList.map((t, i) => `${i+1}. ${t.description} ${t.completed ? '(completed)' : '(pending)'}`).join('\n');
      
      return {
        isTaskCommand: true,
        response: taskListText
      };
    }
    
    // Complete task
    if (lowerMessage.includes('complete task') || lowerMessage.includes('mark task as complete') ||
        lowerMessage.includes('कार्य पूरा') || lowerMessage.includes('कार्य को पूर्ण के रूप में चिह्नित करें')) {
      // Extract task number or description
      let taskIdentifier;
      const match = message.match(/\d+/);
      
      if (match) {
        const taskIndex = parseInt(match[0]) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
          this.updateTask(tasks[taskIndex].id, true);
          return {
            isTaskCommand: true,
            response: language === 'hindi'
              ? `कार्य "${tasks[taskIndex].description}" पूर्ण के रूप में चिह्नित किया गया।`
              : `Task "${tasks[taskIndex].description}" marked as complete.`
          };
        }
      }
      
      return {
        isTaskCommand: true,
        response: language === 'hindi'
          ? 'कृपया एक वैध कार्य संख्या प्रदान करें।'
          : 'Please provide a valid task number.'
      };
    }
    
    // Not a task command
    return {
      isTaskCommand: false
    };
  }
};