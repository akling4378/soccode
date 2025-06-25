// src/hooks/useSeminarState.js
import { useState } from 'react';

export function useSeminarState() {
  // Core state
  const [readerName, setReaderName] = useState('');
  const [showSeminar, setShowSeminar] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('correlation');
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  
  // Interaction state
  const [showCallOnMe, setShowCallOnMe] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  
  // Banter state
  const [showBanter, setShowBanter] = useState(false);
  const [currentBanter, setCurrentBanter] = useState(null);
  const [userSubmittedText, setUserSubmittedText] = useState('');
  
  // Data state
  const [chapterData, setChapterData] = useState(null);
  const [banterData, setBanterData] = useState(null);
  
  // Office Hours state
  const [showOfficeHours, setShowOfficeHours] = useState(false);
  const [officeHoursPersonality, setOfficeHoursPersonality] = useState('');
  const [crossReferences, setCrossReferences] = useState([]);

  return {
    // Core state
    readerName, setReaderName,
    showSeminar, setShowSeminar,
    currentChapter, setCurrentChapter,
    currentBreakpoint, setCurrentBreakpoint,
    
    // Interaction state
    showCallOnMe, setShowCallOnMe,
    userInput, setUserInput,
    apiResponse, setApiResponse,
    
    // Banter state
    showBanter, setShowBanter,
    currentBanter, setCurrentBanter,
    userSubmittedText, setUserSubmittedText,
    
    // Data state
    chapterData, setChapterData,
    banterData, setBanterData,
    
    // Office Hours state
    showOfficeHours, setShowOfficeHours,
    officeHoursPersonality, setOfficeHoursPersonality,
    crossReferences, setCrossReferences
  };
}