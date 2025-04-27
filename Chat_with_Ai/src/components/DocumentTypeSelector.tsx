import React from 'react';
import { FileText, FileMusic as FileMedical } from 'lucide-react';

interface DocumentTypeSelectorProps {
  language: 'english' | 'hindi';
  onSelect: (type: 'medical' | 'resume') => void;
  onClose: () => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ language, onSelect, onClose }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">
          {language === 'hindi' ? 'दस्तावेज़ प्रकार चुनें' : 'Select Document Type'}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            onSelect('medical');
            onClose();
          }}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
        >
          <FileMedical className="h-8 w-8 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            {language === 'hindi' ? 'चिकित्सा' : 'Medical'}
          </span>
          <span className="text-xs text-gray-500 text-center mt-1">
            {language === 'hindi' 
              ? 'स्वास्थ्य संबंधी प्रश्न और सलाह' 
              : 'Health-related queries and advice'}
          </span>
        </button>

        <button
          onClick={() => {
            onSelect('resume');
            onClose();
          }}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
        >
          <FileText className="h-8 w-8 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            {language === 'hindi' ? 'रेज़्यूमे' : 'Resume'}
          </span>
          <span className="text-xs text-gray-500 text-center mt-1">
            {language === 'hindi' 
              ? 'कैरियर और रेज़्यूमे मार्गदर्शन' 
              : 'Career and resume guidance'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DocumentTypeSelector;