// src/components/OfficeHours.js
import React, { useState } from 'react';
import DialogueRenderer from './DialogueRenderer';

export default function OfficeHours({ 
  isOpen,
  chapterTitle, 
  chapterConcepts = [], 
  officeHoursPersonality = "",
  onClose 
}) {
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_EXCHANGES = 5;

  // Reset conversation when component opens
  React.useEffect(() => {
    if (isOpen) {
      setConversation([]);
      setCurrentInput('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmitComment = async () => {
    if (!currentInput.trim() || conversation.length >= MAX_EXCHANGES * 2) return;

    const userComment = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user comment to conversation
    const updatedConversation = [...conversation, { speaker: 'User', text: userComment }];
    setConversation(updatedConversation);

    try {
      // Build prompt with chapter-specific context
      const conceptsText = chapterConcepts
        .map(concept => `- ${concept.name}: ${concept.shortDefinition}. ${concept.elaboration}`)
        .join('\n');

      const officeHoursPrompt = `
OFFICE HOURS SESSION - ${chapterTitle}

CHAPTER CONCEPTS:
${conceptsText}

${officeHoursPersonality}

CONVERSATION HISTORY:
${updatedConversation.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')}

Continue the office hours discussion as Professor Hartwell. Respond thoughtfully to the student's latest comment.`;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: officeHoursPrompt }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      const professorResponse = data.response || data.message || data.text || "I received your question but had trouble processing my response.";
      
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: typeof professorResponse === 'string' ? professorResponse : "I received your question but had trouble processing my response."
      }]);

    } catch (error) {
      console.error('Office Hours API Error:', error);
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: `I apologize, but I'm having technical difficulties. Please try your question again.`
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

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Office Hours with Professor Hartwell</h2>
            <p className="text-blue-100 text-sm">{chapterTitle}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              Exchanges: {exchangesUsed}/{MAX_EXCHANGES}
            </div>
            <button
              onClick={onClose}
              className="mt-1 text-blue-100 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversation.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="mb-2">Welcome to office hours!</p>
              <p className="text-sm">Ask me anything about {chapterTitle} or related concepts.</p>
            </div>
          )}
          
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

        {/* Input Area */}
        <div className="border-t p-4">
          {exchangesRemaining > 0 ? (
            <div className="space-y-3">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="Ask a question about this chapter or share your thoughts..."
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
                
                <button
                  onClick={handleSubmitComment}
                  disabled={!currentInput.trim() || isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-700 mb-3">
                You've reached the maximum of {MAX_EXCHANGES} exchanges for this session.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Seminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}