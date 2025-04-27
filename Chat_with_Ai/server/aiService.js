import { pipeline } from '@xenova/transformers';

// Mock AI service
const API_KEY = "XAI_STATIC_API_KEY_12345";

// Initialize the pipeline
let classifier;
(async () => {
  classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
})();

// Sample responses for different query types
const medicalResponses = {
  english: [
    "Based on your symptoms, it would be advisable to consult a healthcare professional for a proper diagnosis.",
    "Remember to maintain a balanced diet and regular exercise routine for better health.",
    "Make sure to get adequate sleep and manage stress levels for overall well-being.",
    "Consider keeping a health journal to track your symptoms and discuss them with your doctor."
  ],
  hindi: [
    "आपके लक्षणों के आधार पर, उचित निदान के लिए स्वास्थ्य पेशेवर से परामर्श करना उचित होगा।",
    "बेहतर स्वास्थ्य के लिए संतुलित आहार और नियमित व्यायाम दिनचर्या बनाए रखें।",
    "समग्र स्वास्थ्य के लिए पर्याप्त नींद लें और तनाव के स्तर को नियंत्रित करें।",
    "अपने लक्षणों को ट्रैक करने और डॉक्टर के साथ चर्चा करने के लिए एक स्वास्थ्य डायरी रखें।"
  ]
};

const resumeResponses = {
  english: [
    "Your resume should highlight your key achievements and quantifiable results.",
    "Consider using action verbs and industry-specific keywords in your resume.",
    "Tailor your resume to each job application by matching keywords from the job description.",
    "Keep your resume concise and well-organized with clear section headings."
  ],
  hindi: [
    "आपके रेज़्यूमे में आपकी प्रमुख उपलब्धियों और मापने योग्य परिणामों को उजागर किया जाना चाहिए।",
    "अपने रेज़्यूमे में क्रिया शब्दों और उद्योग-विशिष्ट कीवर्ड का उपयोग करें।",
    "नौकरी के विवरण से कीवर्ड मिलाकर प्रत्येक नौकरी आवेदन के लिए अपना रेज़्यूमे अनुकूलित करें।",
    "अपने रेज़्यूमे को स्पष्ट अनुभाग शीर्षकों के साथ संक्षिप्त और सुव्यवस्थित रखें।"
  ]
};

const newsResponses = {
  english: [
    "Today's top headlines include advances in renewable energy technology and new economic policies.",
    "Recent tech industry news shows significant growth in AI adoption across various sectors.",
    "Global markets are showing positive trends with technology stocks leading the gains.",
    "Scientific breakthroughs in quantum computing were announced this week by leading research institutions."
  ],
  hindi: [
    "आज के शीर्ष समाचारों में अक्षय ऊर्जा प्रौद्योगिकी में प्रगति और नई आर्थिक नीतियां शामिल हैं।",
    "हाल के तकनीकी उद्योग समाचार विभिन्न क्षेत्रों में AI अपनाने में महत्वपूर्ण वृद्धि दिखाते हैं।",
    "वैश्विक बाजार सकारात्मक रुझान दिखा रहे हैं, जिसमें प्रौद्योगिकी स्टॉक लाभ का नेतृत्व कर रहे हैं।",
    "क्वांटम कंप्यूटिंग में वैज्ञानिक सफलताओं की घोषणा इस सप्ताह प्रमुख अनुसंधान संस्थानों द्वारा की गई थी।"
  ]
};

const studyResponses = {
  english: [
    "When studying machine learning, start with the fundamentals of statistics and linear algebra before advancing to neural networks.",
    "For web development, I recommend learning HTML, CSS, and JavaScript basics, then progressing to frameworks like React or Vue.",
    "To master Python programming, practice regularly with small projects that solve real problems you care about.",
    "When learning about data structures, visualize how they work internally to better understand their time and space complexity."
  ],
  hindi: [
    "मशीन लर्निंग का अध्ययन करते समय, न्यूरल नेटवर्क पर आगे बढ़ने से पहले सांख्यिकी और रैखिक बीजगणित के मूल सिद्धांतों से शुरुआत करें।",
    "वेब विकास के लिए, मैं HTML, CSS और JavaScript की मूल बातें सीखने की सलाह देता हूं, फिर React या Vue जैसे फ्रेमवर्क पर आगे बढ़ें।",
    "पायथन प्रोग्रामिंग में महारत हासिल करने के लिए, ऐसे छोटे प्रोजेक्ट्स के साथ नियमित रूप से अभ्यास करें जो आपके लिए महत्वपूर्ण वास्तविक समस्याओं को हल करते हैं।",
    "डेटा स्ट्रक्चर्स के बारे में जानते समय, यह विज़ुअलाइज़ करें कि वे आंतरिक रूप से कैसे काम करते हैं ताकि उनके समय और स्थान जटिलता को बेहतर ढंग से समझा जा सके।"
  ]
};

const guidanceResponses = {
  english: [
    "To improve productivity, try the Pomodoro Technique: work for 25 minutes, then take a 5-minute break.",
    "When learning a new skill, consistency is more important than duration. Practice for 20 minutes daily rather than 3 hours once a week.",
    "For better public speaking, record yourself and watch it back to identify areas for improvement.",
    "To manage stress effectively, incorporate regular exercise, adequate sleep, and mindfulness meditation into your routine."
  ],
  hindi: [
    "उत्पादकता में सुधार के लिए, पोमोडोरो तकनीक का प्रयास करें: 25 मिनट काम करें, फिर 5 मिनट का ब्रेक लें।",
    "एक नया कौशल सीखते समय, अवधि की तुलना में निरंतरता अधिक महत्वपूर्ण है। सप्ताह में एक बार 3 घंटे के बजाय रोजाना 20 मिनट का अभ्यास करें।",
    "बेहतर सार्वजनिक वक्तृत्व के लिए, अपनी रिकॉर्डिंग करें और सुधार के क्षेत्रों की पहचान करने के लिए इसे वापस देखें।",
    "तनाव को प्रभावी ढंग से प्रबंधित करने के लिए, अपनी दिनचर्या में नियमित व्यायाम, पर्याप्त नींद और माइंडफुलनेस मेडिटेशन को शामिल करें।"
  ]
};

export const aiService = {
  async getResponse(message, language, interviewMode) {
    console.log(`Processing message with API key: ${API_KEY}`);
    
    // Check for document content
    if (message.includes('Analyzing document content:')) {
      const documentContent = message.split('Analyzing document content:\n')[1];
      
      try {
        // Use the classifier to analyze the document content
        const result = await classifier(documentContent);
        const sentiment = result[0].label;
        
        // Generate response based on document analysis
        return language === 'hindi'
          ? `मैंने दस्तावेज़ का विश्लेषण किया है। यह ${sentiment === 'POSITIVE' ? 'सकारात्मक' : 'नकारात्मक'} प्रतीत होता है। क्या आप कोई विशिष्ट प्रश्न पूछना चाहेंगे?`
          : `I've analyzed the document. It appears to be ${sentiment.toLowerCase()}. Would you like to ask any specific questions about it?`;
      } catch (error) {
        console.error('Error analyzing document:', error);
        return language === 'hindi'
          ? 'क्षमा करें, दस्तावेज़ विश्लेषण में त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, there was an error analyzing the document. Please try again.';
      }
    }
    
    // Check for document type prefix
    const isMedical = message.includes('[MEDICAL]');
    const isResume = message.includes('[RESUME]');
    
    if (isMedical) {
      return this.getRandomResponse(medicalResponses[language]);
    }
    
    if (isResume) {
      return this.getRandomResponse(resumeResponses[language]);
    }
    
    const messageType = this.classifyMessage(message);
    
    if (interviewMode) {
      return this.handleInterviewMode(message, language);
    }
    
    switch (messageType) {
      case 'news':
        return this.getRandomResponse(newsResponses[language]);
      case 'study':
        return this.getRandomResponse(studyResponses[language]);
      case 'guidance':
        return this.getRandomResponse(guidanceResponses[language]);
      default:
        return language === 'hindi'
          ? `आपने कहा: "${message}". मैं आपकी कैसे सहायता कर सकता हूं? आप चिकित्सा सलाह या रेज़्यूमे मार्गदर्शन के लिए दस्तावेज़ प्रकार चुन सकते हैं।`
          : `You said: "${message}". How can I assist you? You can select a document type for medical advice or resume guidance.`;
    }
  },
  
  classifyMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('news') || lowerMessage.includes('update') || 
        lowerMessage.includes('समाचार') || lowerMessage.includes('अपडेट')) {
      return 'news';
    }
    
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || 
        lowerMessage.includes('अध्ययन') || lowerMessage.includes('सीखना')) {
      return 'study';
    }
    
    if (lowerMessage.includes('advice') || lowerMessage.includes('help') || 
        lowerMessage.includes('guide') || lowerMessage.includes('how to') ||
        lowerMessage.includes('सलाह') || lowerMessage.includes('मदद') || 
        lowerMessage.includes('मार्गदर्शन') || lowerMessage.includes('कैसे')) {
      return 'guidance';
    }
    
    return 'general';
  },
  
  getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  },
  
  handleInterviewMode(message, language) {
    const sessionId = 'default'; // In a real app, you'd use a unique session ID
    
    if (!interviewSessions.has(sessionId)) {
      const questions = interviewQuestions[language];
      const randomIndex = Math.floor(Math.random() * questions.length);
      interviewSessions.set(sessionId, {
        currentQuestion: questions[randomIndex].question,
        followUps: questions[randomIndex].followUps,
        followUpIndex: 0,
        asked: false
      });
    }
    
    const session = interviewSessions.get(sessionId);
    
    if (!session.asked || message.length > 0) {
      session.asked = true;
      
      if (session.followUpIndex < session.followUps.length) {
        const followUp = session.followUps[session.followUpIndex];
        session.followUpIndex++;
        return followUp;
      } else {
        const questions = interviewQuestions[language];
        const randomIndex = Math.floor(Math.random() * questions.length);
        
        session.currentQuestion = questions[randomIndex].question;
        session.followUps = questions[randomIndex].followUps;
        session.followUpIndex = 0;
        
        return session.currentQuestion;
      }
    }
    
    return session.currentQuestion;
  }
};