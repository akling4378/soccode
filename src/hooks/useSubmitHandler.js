// src/hooks/useSubmitHandler.js
import { callClaudeAPI } from '../services/apiService';
import { parseDialogue } from '../utils/dialogueParser';

export function useSubmitHandler({ 
  state, 
  setState, 
  startBanter 
}) {
  const {
    userInput,
    readerName,
    chapterData,
    currentBreakpoint,
    setUserSubmittedText,
    setApiResponse,
    setShowCallOnMe,
    setUserInput
  } = state;

  const handleSubmitResponse = async () => {
    try {
      const submittedText = userInput;
      setUserSubmittedText(submittedText);
      startBanter();
      
      const response = await callClaudeAPI({
        userInput: submittedText,
        readerName,
        chapterData,
        currentBreakpoint
      });

      const formattedResponse = parseDialogue(response);
      
      setApiResponse(formattedResponse);
      setShowCallOnMe(false);
      setUserInput('');
    } catch (error) {
      console.error('API Error:', error);
      setApiResponse('Sorry, there was an error processing your comment. Please try again.');
      setShowCallOnMe(false);
      setUserInput('');
    }
  };

  return { handleSubmitResponse };
}