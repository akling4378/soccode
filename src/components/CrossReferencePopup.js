// src/components/CrossReferencePopup.js
import React from 'react';
import { chaptersConfig } from '../data/chapters-config';

export default function CrossReferencePopup({ concept, isVisible, onClose, position }) {
  if (!isVisible || !concept) return null;

  // Get chapter title from chapters-config.js
  const getChapterTitle = (chapterId) => {
    const chapter = chaptersConfig.find(ch => ch.id === chapterId);
    return chapter ? chapter.title : chapterId;
  };

  return (
    <>
      {/* Backdrop to close popup when clicked */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Popup content */}
      <div 
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
        style={{
          left: position.x + 'px',
          top: position.y + 'px',
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ×
        </button>
        
        <div className="pr-6">
          <h3 className="font-bold text-gray-800 mb-2">
            {concept.name}
          </h3>
          
          <p className="text-sm text-gray-700 mb-2">
            {concept.shortDefinition}
          </p>
          
          <p className="text-xs text-gray-600 mb-3">
            {concept.elaboration}
          </p>
          
          <p className="text-xs italic text-blue-600">
            Explained in {getChapterTitle(concept.homeChapter)}
          </p>
        </div>
      </div>
    </>
  );
}