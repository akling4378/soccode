"use client"
import React, { useState } from 'react';
import DialogueRenderer from '../../components/DialogueRenderer';

export default function OfficeHoursTest() {
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitComment = async () => {
    if (!currentInput.trim()) return;

    const userComment = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user comment to conversation
    const updatedConversation = [...conversation, { speaker: 'User', text: userComment }];
    setConversation(updatedConversation);

    try {
      console.log('About to make fetch call to /api/claude');
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `You are Professor Hartwell in office hours about Evolutionary Psychology.

CONTEXT: Warriors and Worriers model suggests males evolved warrior traits (competition, rules, teams) while females evolved worrier traits (safety, avoiding conflict, covert competition). This connects to evolutionary psychology debates about nature vs nurture.

CONVERSATION HISTORY:
${updatedConversation.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')}

Student just said: "${userComment}". Please respond as Professor Hartwell.`
        }),
      });
      console.log('Fetch completed, response status:', response.status);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Parsed response data:', data);
      
      const professorResponse = data.response || "Sorry, I had trouble responding.";
      
      console.log('About to update conversation with professor response');
      const finalConversation = [...updatedConversation, { 
        speaker: 'Professor Hartwell', 
        text: professorResponse
      }];
      setConversation(finalConversation);
      console.log('Conversation updated successfully');

    } catch (error) {
      console.error('API Error:', error);
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: 'Sorry, I had technical difficulties.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Office Hours API Test
        </h1>
        
        {/* Debug info */}
        <div className="text-xs text-red-500 border border-red-200 p-2 mb-4">
          DEBUG: Conversation length: {conversation.length} | Loading: {isLoading ? 'true' : 'false'}
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
        <div className="space-y-4">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Ask Professor Hartwell a question"
            disabled={isLoading}
          />
          
          <button
            onClick={handleSubmitComment}
            disabled={!currentInput.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}