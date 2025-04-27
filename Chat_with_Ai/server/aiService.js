import { pipeline } from '@xenova/transformers';

// Mock AI service
const API_KEY = "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";

// Initialize the pipeline
let classifier;
(async () => {
  classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
})();

// ... (your canned responses objects: medicalResponses, resumeResponses, etc.)

export const aiService = {
  async getResponse(message, language, interviewMode) {
    // 1️⃣ Document analysis block (unchanged)
    if (message.includes('Analyzing document content:')) {
      const documentContent = message.split('Analyzing document content:\n')[1];
      try {
        const result = await classifier(documentContent);
        const sentiment = result[0].label;
        return language === 'hindi'
          ? `मैंने दस्तावेज़ का विश्लेषण किया है। यह ${
              sentiment === 'POSITIVE' ? 'सकारात्मक' : 'नकारात्मक'
            } प्रतीत होता है। क्या आप कोई विशिष्ट प्रश्न पूछना चाहेंगे?`
          : `I've analyzed the document. It appears to be ${
              sentiment.toLowerCase()
            }. Would you like to ask any specific questions about it?`;
      } catch (error) {
        console.error('Error analyzing document:', error);
        return language === 'hindi'
          ? 'क्षमा करें, दस्तावेज़ विश्लेषण में त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, there was an error analyzing the document. Please try again.';
      }
    }

    // 2️⃣ Canned-response checks (medical / resume prefixes)
    if (message.includes('[MEDICAL]')) {
      return this.getRandomResponse(medicalResponses[language]);
    }
    if (message.includes('[RESUME]')) {
      return this.getRandomResponse(resumeResponses[language]);
    }

    // 3️⃣ Classify into news / study / guidance
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
      // no default: fall through to LLM call
    }

    // 4️⃣ If no canned response, call the remote LLM
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o',
            messages: [{ role: 'user', content: message }],
          }),
        }
      );
      const data = await response.json();
      // Extract the AI's reply text
      const aiText =
        data.choices?.[0]?.message?.content ||
        (language === 'hindi'
          ? 'माफ़ कीजिए, मुझे जवाब नहीं मिला।'
          : 'Sorry, no response received.');
      return aiText;
    } catch (err) {
      console.error('LLM fetch error:', err);
      return language === 'hindi'
        ? 'क्षमा करें, AI सेवा उपलब्ध नहीं है।'
        : 'Sorry, the AI service is unavailable.';
    }
  },

  // ... (other methods: classifyMessage, getRandomResponse, handleInterviewMode) ...
};
