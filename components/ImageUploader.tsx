
import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, disabled]);
  
  const handleClick = () => {
      fileInputRef.current?.click();
  }

  const dropzoneClasses = `
    flex flex-col items-center justify-center p-8 md:p-12 border-4 border-dashed rounded-xl 
    transition-all duration-300 cursor-pointer
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-green-50 hover:bg-green-100'}
    ${isDragging ? 'border-green-600' : 'border-green-300'}
  `;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        disabled={disabled}
      />
      <UploadIcon />
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Drag & drop your image here
      </p>
      <p className="text-gray-500">or</p>
      <button
        type="button"
        className="mt-2 font-bold text-green-600 hover:text-green-800 transition-colors"
        disabled={disabled}
      >
        Browse Files
      </button>
      <p className="text-xs text-gray-400 mt-4">Supports: JPG, JPEG, PNG</p>
    </div>
  );
};
