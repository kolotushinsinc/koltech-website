import { useState, useRef } from 'react';
import { FilePreview } from '../../types/koltech-line';
import { MAX_FILES } from '../../utils/koltech-line/constants';

export const useFileUpload = (onWarning?: (message: string) => void) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    // Limit to MAX_FILES total
    const remainingSlots = MAX_FILES - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length < files.length && onWarning) {
      onWarning(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`);
    }

    setSelectedFiles(prev => [...prev, ...filesToAdd]);
    
    // Generate previews
    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => [...prev, {
            file,
            preview: e.target?.result as string,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
  };

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter(preview => preview.file !== fileToRemove));
    
    // Reset file input to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length !== files.length && onWarning) {
      onWarning('Only image and video files are supported');
    }
    
    if (mediaFiles.length > 0) {
      addFiles(mediaFiles);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    selectedFiles,
    filePreviews,
    isDragging,
    fileInputRef,
    handleFileSelect,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFiles,
    setSelectedFiles,
    setFilePreviews
  };
};
