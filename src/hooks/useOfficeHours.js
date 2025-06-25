// src/hooks/useOfficeHours.js - Business logic (55 lines)
import { useState, useCallback } from 'react';

export function useOfficeHours(chapterTitle, chapterConcepts, officeHoursPersonality) {
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_EXCHANGES = 5;

  const resetConversation = useCallback(() => {
    setConversation([]);
    setCurrentInput('');
    setIsLoading(false);
  }, []);

  const handleSubmitComment = useCallback(async () => {
    if (!currentInput.trim() || conversation.length >= MAX_EXCHANGES * 2) return;

    const userComment = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    const updatedConversation = [...conversation, { speaker: 'User', text: userComment }];
    setConversation(updatedConversation);

    try {
      const conceptsText = chapterConcepts
        .map(concept => `- ${concept.name}: ${concept.shortDefinition}. ${concept.elaboration}`)
        .join('\n');

      const prompt = `OFFICE HOURS SESSION - ${chapterTitle}

CHAPTER CONCEPTS:
${conceptsText}

PERSONALITY AND BEHAVIOR RULES:
${JSON.stringify(officeHoursPersonality, null, 2)}

CONVERSATION HISTORY:
${updatedConversation.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')}

Student just said: "${userComment}". Continue the office hours discussion as Professor Hartwell.`;
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error(`API call failed: ${response.status}`);

      const data = await response.json();
      const professorResponse = data.response || "I received your question but had trouble processing my response.";
      
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: professorResponse
      }]);

    } catch (error) {
      console.error('Office Hours API Error:', error);
      setConversation(prev => [...prev, { 
        speaker: 'Professor Hartwell', 
        text: 'I apologize, but I\'m having technical difficulties. Please try your question again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, conversation, chapterTitle, chapterConcepts, officeHoursPersonality]);

  const exchangesUsed = Math.floor(conversation.length / 2);
  const exchangesRemaining = MAX_EXCHANGES - exchangesUsed;

  return {
    conversation,
    currentInput,
    setCurrentInput,
    isLoading,
    exchangesUsed,
    exchangesRemaining,
    handleSubmitComment,
    resetConversation
  };
}