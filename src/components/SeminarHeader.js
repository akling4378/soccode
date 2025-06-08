// src/components/SeminarHeader.js
import React from 'react';

export default function SeminarHeader({ 
  currentChapter, 
  onChapterChange, 
  readerName, 
  currentBreakpointData,
  availableChapters 
}) {
  return (
    <div className="bg-blue-600 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">The Social Code</h1>
        <select
          value={currentChapter}
          onChange={(e) => onChapterChange(e.target.value)}
          className="bg-blue-700 text-white px-3 py-1 rounded border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {availableChapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>
      <p className="text-blue-100">Professor Hartwell's Seminar • Welcome, {readerName}!</p>
      <p className="text-blue-200 text-sm mt-2">
        {currentBreakpointData.subheading}
      </p>
    </div>
  );
}