// src/app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { loadKnowledgeBase } from '../lib/dataLoader';
import { chaptersConfig } from '../data/chapters-config';
import SeminarEntry from '../components/SeminarEntry';
import SeminarHeader from '../components/SeminarHeader';
import SeminarContent from '../components/SeminarContent';

export default function SeminarPage() {
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
  
  // Use chapters config as single source of truth
  const availableChapters = chaptersConfig;

  // Load data on mount and chapter change
  useEffect(() => {
    loadChapterData(currentChapter);
    loadBanterData();
  }, [currentChapter]);

  // Data loading functions
  const loadChapterData = async (chapterId) => {
    try {
      // Find the chapter config to get the filename
      const chapterConfig = chaptersConfig.find(ch => ch.id === chapterId);
      if (!chapterConfig) {
        throw new Error('Chapter config not found');
      }
      
      const response = await fetch(`/data/chapters/${chapterConfig.filename}`);
      if (!response.ok) throw new Error('Chapter not found');
      const data = await response.json();
      setChapterData(data);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setChapterData({
        id: chapterId,
        title: `${chapterId.replace('-', ' ')} (Coming Soon)`,
        description: "Chapter under development",
        breakpoints: [{
          id: 'placeholder',
          subheading: 'Chapter Under Development',
          dialogue: [{
            speaker: 'Professor Hartwell',
            text: `The ${chapterId.replace('-', ' ')} chapter is being developed. Please check back soon!`
          }],
          hasCallOnMe: false
        }]
      });
    }
  };

  const loadBanterData = async () => {
    try {
      const response = await fetch('/data/seminar-banter.JSON');
      if (!response.ok) throw new Error('Banter data not found');
      const data = await response.json();
      setBanterData(data);
    } catch (error) {
      console.error('Error loading banter data:', error);
    }
  };

  // Banter management
  const startBanter = () => {
    if (!banterData?.banterDialogues) return;
    
    const randomIndex = Math.floor(Math.random() * banterData.banterDialogues.length);
    const selectedBanter = banterData.banterDialogues[randomIndex];
    
    setCurrentBanter(selectedBanter);
    setShowBanter(true);
  };

  // Event handlers
  const handleNameSubmit = () => setShowSeminar(true);

  const handleChapterChange = (chapterId) => {
    // Check if chapter exists in config
    const chapterExists = chaptersConfig.some(ch => ch.id === chapterId);
    if (!chapterExists) {
      alert('Chapter coming soon!');
      return;
    }
    
    setCurrentChapter(chapterId);
    setCurrentBreakpoint(0);
    setShowCallOnMe(false);
    setApiResponse('');
  };

  const handleCallOnMe = () => setShowCallOnMe(true);

  const handleCancelInput = () => setShowCallOnMe(false);

  const handleSubmitResponse = async () => {
    try {
      const submittedText = userInput;
      setUserSubmittedText(submittedText);
      startBanter();
      
      const currentBreakpointData = chapterData.breakpoints[currentBreakpoint];
      const knowledgeBase = await loadKnowledgeBase();
      
      const globalInstructions = knowledgeBase.globalPromptInstructions || {
        baseContext: "You are in an interactive seminar called 'The Social Code' on human interdependence.",
        behaviorRules: [
          "Stay in character and maintain their personalities.",
          "Professor Hartwell should address the student by name when he first speaks.",
          "If the comment is off-topic, inappropriate, or disruptive, Drew should IMMEDIATELY interrupt and redirect the conversation."
        ],
        responseFormat: "Format your response as dialogue only.",
        continuationPrompt: "Continue the seminar discussion."
      };
      
      const chapterInstructions = chapterData.promptInstructions || {};
      
      const promptText = `${globalInstructions.baseContext}

CURRENT CHAPTER: ${chapterData.title}
CURRENT SECTION: ${currentBreakpointData.subheading}

${chapterInstructions.focus ? `FOCUS: ${chapterInstructions.focus}` : ''}

CONCEPTS:
${knowledgeBase.concepts.map(c => `- ${c.concept}: ${c.explanation}`).join('\n')}

CHARACTERS:
${Object.entries(knowledgeBase.characters).map(([name, info]) => 
  `- ${name}: ${info.temperament || info.role} - ${info.voice}`
).join('\n')}

A student named ${readerName} just said: "${submittedText}"

RULES:
${globalInstructions.behaviorRules.join('\n')}

${globalInstructions.continuationPrompt}
${globalInstructions.responseFormat}`;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedResponse = parseDialogue(data.response);
      
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

  // Dialogue parsing
  const parseDialogue = (text) => {
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
  };

  // Navigation handlers
  const nextBreakpoint = () => {
    if (!chapterData || currentBreakpoint >= chapterData.breakpoints.length - 1) return;
    setCurrentBreakpoint(currentBreakpoint + 1);
    setShowCallOnMe(false);
    setApiResponse('');
  };

  const prevBreakpoint = () => {
    if (!chapterData || currentBreakpoint <= 0) return;
    setCurrentBreakpoint(currentBreakpoint - 1);
    setShowCallOnMe(false);
    setApiResponse('');
  };

  // Render entry screen
  if (!showSeminar) {
    return (
      <SeminarEntry 
        readerName={readerName}
        setReaderName={setReaderName}
        onSubmit={handleNameSubmit}
      />
    );
  }

  // Render loading screen
  if (!chapterData) {
    return <div className="min-h-screen flex items-center justify-center">Loading chapter...</div>;
  }

  const currentBreakpointData = chapterData.breakpoints[currentBreakpoint];

  // Render main seminar interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <SeminarHeader 
          currentChapter={currentChapter}
          onChapterChange={handleChapterChange}
          readerName={readerName}
          currentBreakpointData={currentBreakpointData}
          availableChapters={availableChapters}
        />
        
        <SeminarContent 
          currentBreakpointData={currentBreakpointData}
          showBanter={showBanter}
          currentBanter={currentBanter}
          readerName={readerName}
          userSubmittedText={userSubmittedText}
          apiResponse={apiResponse}
          showCallOnMe={showCallOnMe}
          userInput={userInput}
          setUserInput={setUserInput}
          onSubmitResponse={handleSubmitResponse}
          onCancelInput={handleCancelInput}
          currentBreakpoint={currentBreakpoint}
          totalBreakpoints={chapterData.breakpoints.length}
          onPrevBreakpoint={prevBreakpoint}
          onNextBreakpoint={nextBreakpoint}
          onCallOnMe={handleCallOnMe}
        />
      </div>
    </div>
  );
}