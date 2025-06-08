// src/components/DialogueRenderer.js
import React from 'react';

export default function DialogueRenderer({ speaker, text }) {
  const getCharacterColor = (speaker) => {
    const colors = {
      'Professor Hartwell': 'text-blue-600',
      'Blake': 'text-red-600',
      'Drew': 'text-green-600',
      'Casey': 'text-purple-600',
      'Avery': 'text-orange-600'
    };
    return colors[speaker] || 'text-gray-600';
  };

  return (
    <div className="mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <span className={`font-semibold ${getCharacterColor(speaker)}`}>
        {speaker}:
      </span>
      <div className="text-gray-800 leading-relaxed mt-1">
        {text}
      </div>
    </div>
  );
}