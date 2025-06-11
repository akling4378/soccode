// src/components/DialogueRenderer.js
import React, { useState, useEffect } from 'react';
import CrossReferencePopup from './CrossReferencePopup';

export default function DialogueRenderer({ speaker, text }) {
  const [crossRefData, setCrossRefData] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Load cross-reference data
  useEffect(() => {
    const loadCrossRefData = async () => {
      try {
        const response = await fetch('/data/cross-references.JSON');
        if (response.ok) {
          const data = await response.json();
          setCrossRefData(data);
        } else {
          console.log('Cross-reference data not found, cross-references disabled');
          setCrossRefData({ concepts: [], chapters: [] });
        }
      } catch (error) {
        console.log('Cross-reference system disabled:', error.message);
        setCrossRefData({ concepts: [], chapters: [] });
      }
    };
    
    loadCrossRefData();
  }, []);

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

  const handleConceptClick = (event, concept) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setActivePopup(concept);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const renderTextWithCrossReferences = (text) => {
    // Safety checks for data loading
    if (!crossRefData || !crossRefData.concepts || !Array.isArray(crossRefData.concepts)) {
      return text;
    }

    // Simple approach: split text and rebuild with clickable concepts
    const matches = [];
    
    // Find all concept matches
    crossRefData.concepts.forEach(concept => {
      if (!concept || !concept.name) return; // Skip invalid concepts
      
      const regex = new RegExp(`\\b${concept.name}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          concept: concept
        });
      }
    });

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Build result with clickable spans
    if (matches.length === 0) return text;

    const parts = [];
    let lastEnd = 0;

    matches.forEach((match, index) => {
      // Add text before this match
      if (match.start > lastEnd) {
        parts.push(text.slice(lastEnd, match.start));
      }
      
      // Add clickable concept
      parts.push(
        <span
          key={`concept-${index}`}
          className="underline decoration-blue-300 decoration-2 cursor-pointer hover:bg-blue-50 px-1 rounded"
          onClick={(e) => handleConceptClick(e, match.concept)}
        >
          {match.text}
        </span>
      );
      
      lastEnd = match.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      parts.push(text.slice(lastEnd));
    }

    return parts;
  };

  return (
    <>
      <div className="mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <span className={`font-semibold ${getCharacterColor(speaker)}`}>
          {speaker}:
        </span>
        <div className="text-gray-800 leading-relaxed mt-1">
          {renderTextWithCrossReferences(text)}
        </div>
      </div>

      <CrossReferencePopup
        concept={activePopup}
        isVisible={!!activePopup}
        onClose={closePopup}
        position={popupPosition}
      />
    </>
  );
}