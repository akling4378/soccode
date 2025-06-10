// src/utils/dialogueParser.js
import React from 'react';

export function parseDialogue(text) {
  let cleanText = text.replace(/This sets up.*?$/gm, '').replace(/The discussion.*?$/gm, '').trim();
  const speakerPattern = /^(Professor Hartwell|Blake|Drew|Casey|Avery):\s*/gm;
  const parts = cleanText.split(speakerPattern);
  const dialogueElements = [];
  
  for (let i = 1; i < parts.length; i += 2) {
    const speaker = parts[i];
    const text = parts[i + 1]?.trim();
    
    if (speaker && text) {
      dialogueElements.push(
        <div key={i} className="mb-3">
          <span className={`font-semibold ${
            speaker === 'Professor Hartwell' ? 'text-blue-600' :
            speaker === 'Blake' ? 'text-red-600' :
            speaker === 'Drew' ? 'text-green-600' :
            speaker === 'Casey' ? 'text-purple-600' :
            speaker === 'Avery' ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {speaker}:
          </span>
          <div className="text-gray-800 leading-relaxed mt-1">
            {text}
          </div>
        </div>
      );
    }
  }
  
  return dialogueElements.length > 0 ? dialogueElements : <div className="text-gray-800">{cleanText}</div>;
}