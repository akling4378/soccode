// src/hooks/useSeminarState.js
import { useState } from 'react';

export function useSeminarState() {
  // Basic seminar state
  const [readerName, setReaderName] = useState('');
  const [showSeminar, setShowSeminar] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('correlation');
  const [chapterData, setChapterData] = useState(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);

  // User interaction state
  const [showCallOnMe, setShowCallOnMe] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [userSubmittedText, setUserSubmittedText] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  // Banter system state
  const [banterData, setBanterData] = useState([]);
  const [currentBanter, setCurrentBanter] = useState(null);
  const [showBanter, setShowBanter] = useState(false);

  // Office hours state
  const [showOfficeHours, setShowOfficeHours] = useState(false);
  const [officeHoursPersonality, setOfficeHoursPersonality] = useState(null);

  // Cross-reference system state
  const [crossReferences, setCrossReferences] = useState([]);

  // Suggested readings state
  const [suggestedReadings, setSuggestedReadings] = useState([]);

  return {
    // Basic seminar state
    readerName,
    setReaderName,
    showSeminar,
    setShowSeminar,
    currentChapter,
    setCurrentChapter,
    chapterData,
    setChapterData,
    currentBreakpoint,
    setCurrentBreakpoint,

    // User interaction state
    showCallOnMe,
    setShowCallOnMe,
    userInput,
    setUserInput,
    userSubmittedText,
    setUserSubmittedText,
    apiResponse,
    setApiResponse,

    // Banter system state
    banterData,
    setBanterData,
    currentBanter,
    setCurrentBanter,
    showBanter,
    setShowBanter,

    // Office hours state
    showOfficeHours,
    setShowOfficeHours,
    officeHoursPersonality,
    setOfficeHoursPersonality,

    // Cross-reference system state
    crossReferences,
    setCrossReferences,

    // Suggested readings state
    suggestedReadings,
    setSuggestedReadings
  };
}