// src/hooks/useOfficeHours.js
import { useState, useCallback, useEffect } from 'react';

export function useOfficeHours(chapterTitle, chapterConcepts, suggestedReadings, officeHoursPersonality) {
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangesUsed, setExchangesUsed] = useState(0);
  
  const exchangesRemaining = Math.max(0, 5 - exchangesUsed);

  const resetConversation = useCallback(() => {
    setConversation([]);
    setCurrentInput('');
    setExchangesUsed(0);
  }, []);

  const buildPrompt = useCallback((conversationHistory) => {
    if (!officeHoursPersonality) return '';

    let prompt = officeHoursPersonality.baseInstructions + '\n\n';

    // Add chapter concepts
    if (chapterConcepts && chapterConcepts.length > 0) {
      prompt += 'Concepts available for this chapter:\n';
      chapterConcepts.forEach(concept => {
        prompt += `- ${concept.name}: ${concept.shortDefinition}\n`;
      });
      prompt += '\n';
    }

    // Add suggested readings
    if (suggestedReadings && suggestedReadings.length > 0) {
      prompt += 'Suggested readings you can recommend when relevant trigger topics arise:\n';
      suggestedReadings.forEach(reading => {
        prompt += `- Trigger: "${reading.trigger}"\n`;
        prompt += `  Recommendation: ${reading.recommendation}\n\n`;
      });
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += 'Conversation so far:\n';
      conversationHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Student' : 'Professor Hartwell'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += officeHoursPersonality.responseGuidelines || '';

    return prompt;
  }, [chapterConcepts, suggestedReadings, officeHoursPersonality]);

  const handleSubmitComment = useCallback(async () => {
    if (!currentInput.trim() || isLoading || exchangesUsed >= 5) return;

    // Create user message in format ConversationArea expects
    const newUserMessage = { speaker: 'User', text: currentInput.trim() };
    const updatedConversation = [...conversation, newUserMessage];
    
    setConversation(updatedConversation);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // For the prompt, convert to the format Claude expects
      const promptConversation = updatedConversation.map(msg => ({
        role: msg.speaker === 'User' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const prompt = buildPrompt(promptConversation);
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create professor message in format ConversationArea expects
      const professorMessage = { 
        speaker: 'Professor Hartwell', 
        text: data.response 
      };
      
      setConversation(prev => [...prev, professorMessage]);
      setExchangesUsed(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        speaker: 'Professor Hartwell', 
        text: 'I apologize, but I encountered an error. Please try again.' 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, conversation, isLoading, exchangesUsed, buildPrompt]);

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