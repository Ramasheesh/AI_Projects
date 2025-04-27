import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { taskService } from './server/taskService.js';
import { aiService } from './server/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Serve static files from the 'dist' directory after build
app.use(express.static(join(__dirname, 'dist')));

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (data) => {
    const { message, language = 'english', interviewMode = false } = data;
    
    // Simulate typing indicator
    socket.emit('typing', true);
    
    // Process user message
    setTimeout(async () => {
      try {
        const result = await processUserMessage(message, language, interviewMode);
        socket.emit('typing', false);
        socket.emit('message', result);
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('typing', false);
        socket.emit('message', {
          text: language === 'hindi' 
            ? 'क्षमा करें, एक त्रुटि हुई है। कृपया बाद में पुनः प्रयास करें।'
            : 'Sorry, an error occurred. Please try again later.',
          tasks: taskService.getTasks(),
          sender: 'ai'
        });
      }
    }, 1500); // Simulate AI processing time
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

async function processUserMessage(message, language, interviewMode) {
  // Check if it's a task-related command
  const taskResult = taskService.processTaskCommand(message, language);
  if (taskResult.isTaskCommand) {
    return {
      text: taskResult.response,
      tasks: taskService.getTasks(),
      sender: 'ai'
    };
  }

  // If not a task command, process with AI service
  const aiResponse = await aiService.getResponse(message, language, interviewMode);
  return {
    text: aiResponse,
    tasks: taskService.getTasks(),
    sender: 'ai'
  };
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





















// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import { taskService } from './server/taskService.js';
// import { aiService } from './server/aiService.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// // Serve static files from the 'dist' directory after build
// app.use(express.static(join(__dirname, 'dist')));

// // Serve the main HTML file for all routes
// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname, 'dist', 'index.html'));
// });

// // WebSocket connection
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('message', async (data) => {
//     const { message, language, interviewMode } = data;
    
//     // Simulate typing indicator
//     socket.emit('typing', true);
    
//     // Process user message
//     setTimeout(async () => {
//       try {
//         const result = await processUserMessage(message, language, interviewMode);
//         socket.emit('typing', false);
//         socket.emit('message', result);
//       } catch (error) {
//         console.error('Error processing message:', error);
//         socket.emit('typing', false);
//         socket.emit('message', {
//           text: language === 'hindi' 
//             ? 'क्षमा करें, एक त्रुटि हुई है। कृपया बाद में पुनः प्रयास करें।'
//             : 'Sorry, an error occurred. Please try again later.',
//           tasks: taskService.getTasks(),
//           sender: 'ai'
//         });
//       }
//     }, 1500); // Simulate AI processing time
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// async function processUserMessage(message, language, interviewMode) {
//   // Check if it's a task-related command
//   const taskResult = taskService.processTaskCommand(message, language);
//   if (taskResult.isTaskCommand) {
//     return {
//       text: taskResult.response,
//       tasks: taskService.getTasks(),
//       sender: 'ai'
//     };
//   }

//   // If not a task command, process with AI service
//   const aiResponse = await aiService.getResponse(message, language, interviewMode);
//   return {
//     text: aiResponse,
//     tasks: taskService.getTasks(),
//     sender: 'ai'
//   };
// }

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });