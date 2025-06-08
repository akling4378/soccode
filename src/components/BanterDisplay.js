// src/components/BanterDisplay.js
import React from 'react';

export default function BanterDisplay({ showBanter, currentBanter, readerName, userSubmittedText }) {
  if (!showBanter || !currentBanter) return null;

  const getCharacterColor = (speaker) => {
    const colors = {
      'Blake': 'text-red-600',
      'Drew': 'text-green-600',
      'Casey': 'text-purple-600',
      'Avery': 'text-orange-600',
      'Professor Hartwell': 'text-blue-600'
    };
    return colors[speaker] || 'text-gray-600';
  };

  return (
    <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      <span className="font-semibold text-yellow-800">Class discussion:</span>
      <div className="mt-2">
        <div className="mb-3">
          <span className="font-semibold text-blue-600">Professor Hartwell:</span>
          <div className="text-gray-800 leading-relaxed mt-1 italic">
            {currentBanter.professorPause}
          </div>
        </div>
        
        {currentBanter.studentBanter.map((line, i) => (
          <div key={i} className="mb-3">
            <span className={`font-semibold ${getCharacterColor(line.speaker)}`}>
              {line.speaker}:
            </span>
            <div className="text-gray-800 leading-relaxed mt-1 italic">
              {line.text}
            </div>
          </div>
        ))}
        
        <div className="mb-3">
          <span className="font-semibold text-blue-600">Professor Hartwell:</span>
          <div className="text-gray-800 leading-relaxed mt-1 italic">
            {currentBanter.professorReturnPre} {readerName} {currentBanter.professorReturnPost} "{userSubmittedText}"
          </div>
        </div>
      </div>
    </div>
  );
}