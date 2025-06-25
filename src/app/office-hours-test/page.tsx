// src/app/office-hours-test/page.tsx
"use client"
import React, { useState } from 'react';

// DialogueRenderer component with cross-reference support
const DialogueRenderer = ({ speaker, text }) => {
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

  // Mock cross-reference concepts for testing
  const concepts = [
    { id: 'first-iron-law', name: 'First Iron Law', shortDefinition: 'Sometimes it\'s this way, and sometimes it\'s that way' },
    { id: 'dunbars-number', name: 'Dunbar\'s Number', shortDefinition: '150 people - cognitive limit for stable relationships' },
    { id: 'correlation', name: 'correlation', shortDefinition: 'measure of how two variables move together' }
  ];

  const [showPopup, setShowPopup] = useState(null);

  const renderTextWithCrossReferences = (text) => {
    // Find all concept matches with their positions
    const matches = [];
    
    concepts.forEach(concept => {
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
    
    // Remove overlapping matches (keep the first one)
    const cleanMatches = [];
    let lastEnd = 0;
    
    matches.forEach(match => {
      if (match.start >= lastEnd) {
        cleanMatches.push(match);
        lastEnd = match.end;
      }
    });
    
    // Build the elements array
    const elements = [];
    let currentIndex = 0;
    
    cleanMatches.forEach((match, index) => {
      // Add text before this match
      if (match.start > currentIndex) {
        elements.push(text.slice(currentIndex, match.start));
      }
      
      // Add clickable concept
      elements.push(
        <span
          key={`${match.concept.id}-${match.start}`}
          className="text-blue-500 underline cursor-pointer hover:text-blue-700"
          onClick={() => setShowPopup(match.concept)}
        >
          {match.text}
        </span>
      );
      
      currentIndex = match.end;
    });
    
    // Add remaining text
    if (currentIndex < text.length) {
      elements.push(text.slice(currentIndex));
    }
    
    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative">
      <span className={`font-semibold ${getCharacterColor(speaker)}`}>
        {speaker}:
      </span>
      <div className="text-gray-800 leading-relaxed mt-1">
        {renderTextWithCrossReferences(text)}
      </div>
      
      {/* Cross-reference popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-md">
            <h3 className="font-bold text-lg mb-2">{showPopup.name}</h3>
            <p className="text-gray-700 mb-4">{showPopup.shortDefinition}</p>
            <button
              onClick={() => setShowPopup(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OfficeHoursTest() {
  const [showOfficeHours, setShowOfficeHours] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_EXCHANGES = 5;

  const handleStartOfficeHours = () => {
    setShowOfficeHours(true);
    setConversation([]);
  };

  const handleSubmitComment = async () => {
    if (!currentInput.trim() || conversation.length >= MAX_EXCHANGES * 2) return;

    const userComment = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user comment to conversation
    const updatedConversation = [...conversation, { speaker: 'User', text: userComment }];
    setConversation(updatedConversation);

    try {
      // Build prompt with cross-reference concepts and seminar atmosphere
      const crossReferenceConcepts = `
CROSS-REFERENCE CONCEPTS:
- First Iron Law: Sometimes it's this way, and sometimes it's that way
- Dunbar's Number: 150 people - cognitive limit for stable relationships  
- correlation: measure of how two variables move together
- Warriors and Worriers: Benenson's theory of gender behavioral differences
- cultural evolution: humans accumulate shared knowledge across generations
`;

      const seminarAtmosphere = `
OFFICE HOURS PERSONALITY:
You are Professor Hartwell in office hours - more personal and exploratory than in the seminar. 
You can go deeper into concepts, ask follow-up questions, and explore tangents.
Maintain your scholarly but accessible voice. Be encouraging but intellectually rigorous.
Reference concepts from the cross-reference table when relevant.
`;

      const conversationHistory = updatedConversation
        .map(msg => `${msg.speaker}: ${msg.text}`)
        .join('\n');

      const prompt = `${crossReferenceConcepts}

${seminarAtmosphere}

CONVERSATION HISTORY:
${conversationHistory}

Continue the office hours discussion. Respond as Professor Hartwell would - thoughtful, engaging, and willing to explore ideas in depth.`;

      console.log('Sending prompt:', prompt); // Debug log
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data); // Debug log
      
      // Add professor response - check different possible response formats
      const professorResponse = data.response || data.message || data.text || data;
      
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: typeof professorResponse === 'string' ? professorResponse : "I received your question but had trouble processing my response."
      }]);

    } catch (error) {
      console.error('Full API Error:', error);
      // More specific fallback that indicates the error
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: `I apologize, but I'm having technical difficulties. Error: ${error.message}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const exchangesUsed = Math.floor(conversation.length / 2);
  const exchangesRemaining = MAX_EXCHANGES - exchangesUsed;

  if (!showOfficeHours) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Office Hours Test
          </h1>
          <button
            onClick={handleStartOfficeHours}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Office Hours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Office Hours with Professor Hartwell
          </h1>
          <div className="text-sm text-gray-500">
            Exchanges: {exchangesUsed}/{MAX_EXCHANGES}
          </div>
        </div>
        
        {/* Display conversation using DialogueRenderer */}
        <div className="mb-6 space-y-2">
          {conversation.map((message, index) => (
            <DialogueRenderer 
              key={index}
              speaker={message.speaker}
              text={message.text}
            />
          ))}
          
          {isLoading && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <span className="text-gray-600">Professor Hartwell is thinking...</span>
            </div>
          )}
        </div>

        {/* Input section */}
        {exchangesRemaining > 0 ? (
          <div className="space-y-4">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder={conversation.length === 0 ? "Type your question or comment here" : "Submit another comment or question"}
              disabled={isLoading}
              maxLength={300}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {currentInput.length}/300 characters
                {exchangesRemaining <= 2 && (
                  <span className="ml-2 text-orange-600">
                    ({exchangesRemaining} exchanges remaining)
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitComment}
                  disabled={!currentInput.trim() || isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Submit'}
                </button>
                
                <button
                  onClick={() => {
                    setShowOfficeHours(false);
                    setConversation([]);
                    setCurrentInput('');
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-4">
              You've reached the maximum of {MAX_EXCHANGES} exchanges for this session.
            </p>
            <button
              onClick={() => {
                setShowOfficeHours(false);
                setConversation([]);
                setCurrentInput('');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}