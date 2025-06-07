// src/components/DialogueRenderer.jsx
import React from 'react';

export default function DialogueRenderer({ dialogue }) {
  return (
    <div className="space-y-4 mb-4">
      {dialogue.map((dialogueItem, index) => (
        <div key={index}>
          <span className={`font-semibold ${
            dialogueItem.speaker === 'Professor Hartwell' ? 'text-blue-600' :
            dialogueItem.speaker === 'Blake' ? 'text-red-600' :
            dialogueItem.speaker === 'Drew' ? 'text-green-600' :
            dialogueItem.speaker === 'Casey' ? 'text-purple-600' :
            dialogueItem.speaker === 'Avery' ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {dialogueItem.speaker}:
          </span>
          <div className="text-gray-800 leading-relaxed mt-1">
            {dialogueItem.text}
          </div>
        </div>
      ))}
    </div>
  );
}