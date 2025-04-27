import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Loader } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface FileUploadProps {
  language: 'english' | 'hindi';
  onFileContent: (content: string) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ language, onFileContent, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        onFileContent(fullText);
      } else {
        const text = await file.text();
        onFileContent(text);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(language === 'hindi' 
        ? 'फ़ाइल प्रोसेसिंग में त्रुटि हुई' 
        : 'Error processing file');
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {language === 'hindi' ? 'फ़ाइल अपलोड करें' : 'Upload File'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">
              {language === 'hindi' 
                ? 'फ़ाइल प्रोसेस की जा रही है...' 
                : 'Processing file...'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{fileName}</p>
          </div>
        ) : (
          <>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {language === 'hindi'
                ? 'फ़ाइल को यहाँ खींचें और छोड़ें या'
                : 'Drag and drop file here or'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {language === 'hindi' ? 'फ़ाइल चुनें' : 'Choose File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;