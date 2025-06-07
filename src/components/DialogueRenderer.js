// src/components/DialogueRenderer.js
import React from 'react';

export default function DialogueRenderer({ dialogue }) {
  return (
    <div className="space-y-4 mb-4">
      {dialogue.map((dialogueItem, index) => (
        <div key={index} className={`p-4 rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md ${
          dialogueItem.speaker === 'Professor Hartwell' ? 'bg-blue-50 border-blue-400 hover:bg-blue-100' :
          dialogueItem.speaker === 'Blake' ? 'bg-red-50 border-red-400 hover:bg-red-100' :
          dialogueItem.speaker === 'Drew' ? 'bg-green-50 border-green-400 hover:bg-green-100' :
          dialogueItem.speaker === 'Casey' ? 'bg-purple-50 border-purple-400 hover:bg-purple-100' :
          dialogueItem.speaker === 'Avery' ? 'bg-orange-50 border-orange-400 hover:bg-orange-100' : 'bg-gray-50 border-gray-400 hover:bg-gray-100'
        }`}>
          <div className={`font-bold text-sm uppercase tracking-wide mb-3 ${
            dialogueItem.speaker === 'Professor Hartwell' ? 'text-blue-700' :
            dialogueItem.speaker === 'Blake' ? 'text-red-700' :
            dialogueItem.speaker === 'Drew' ? 'text-green-700' :
            dialogueItem.speaker === 'Casey' ? 'text-purple-700' :
            dialogueItem.speaker === 'Avery' ? 'text-orange-700' : 'text-gray-700'
          }`}>
            {dialogueItem.speaker}
          </div>
          <div className="text-gray-800 leading-relaxed text-base">
            {dialogueItem.text}
          </div>
        </div>
      ))}
    </div>
  );
}