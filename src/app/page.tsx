// src/app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { loadKnowledgeBase } from '../lib/dataLoader';
import { availableChapters, isPlaceholderChapter, getPlaceholderMessage } from '../data/chapters-config';

// Beautiful DialogueRenderer with styling like the converter
function DialogueRenderer({ dialogue }) {
  return (
    <div className="space-y-4 mb-4">
      {dialogue.map((dialogueItem, index) => (
        <div key={index} className={`p-3 rounded-lg border-l-4 ${
          dialogueItem.speaker === 'Professor Hartwell' ? 'bg-blue-50 border-blue-400' :
          dialogueItem.speaker === 'Blake' ? 'bg-red-50 border-red-400' :
          dialogueItem.speaker === 'Drew' ? 'bg-green-50 border-green-400' :
          dialogueItem.speaker === 'Casey' ? 'bg-purple-50 border-purple-400' :
          dialogueItem.speaker === 'Avery' ? 'bg-orange-50 border-orange-400' : 'bg-gray-50 border-gray-400'
        }`}>
          <div className={`font-semibold mb-2 ${
            dialogueItem.speaker === 'Professor Hartwell' ? 'text-blue-600' :
            dialogueItem.speaker === 'Blake' ? 'text-red-600' :
            dialogueItem.speaker === 'Drew' ? 'text-green-600' :
            dialogueItem.speaker === 'Casey' ? 'text-purple-600' :
            dialogueItem.speaker === 'Avery' ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {dialogueItem.speaker}:
          </div>
          <div className="text-gray-800 leading-relaxed">
            {dialogueItem.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SeminarPage() {
  const [readerName, setReaderName] = useState('');
  const [showSeminar, setShowSeminar] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('correlation');
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [showCallOnMe, setShowCallOnMe] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [showBanter, setShowBanter] = useState(false);
  const [currentBanter, setCurrentBanter] = useState(null);
  const [userSubmittedText, setUserSubmittedText] = useState('');
  
  const [chapterData, setChapterData] = useState(null);
  const [banterData, setBanterData] = useState(null);

  useEffect(() => {
    loadChapterData(currentChapter);
    loadBanterData();
  }, [currentChapter]);

  const loadChapterData = async (chapterId) => {
    try {
      const response = await fetch(`/data/chapters/${chapterId}.JSON`);
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

  const startBanter = () => {
    if (!banterData || !banterData.banterDialogues) return;
    
    const randomIndex = Math.floor(Math.random() * banterData.banterDialogues.length);
    const selectedBanter = banterData.banterDialogues[randomIndex];
    
    setCurrentBanter(selectedBanter);
    setShowBanter(true);
  };

  const handleNameSubmit = () => {
    if (readerName.trim()) {
      setShowSeminar(true);
    }
  };

  const handleChapterChange = (chapterId) => {
    if (isPlaceholderChapter(chapterId)) {
      const message = getPlaceholderMessage(chapterId);
      if (message) alert(message);
      return;
    }
    setCurrentChapter(chapterId);
    setCurrentBreakpoint(0);
    setShowCallOnMe(false);
    setApiResponse('');
  };

  const handleCallOnMe = () => {
    setShowCallOnMe(true);
  };

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: promptText,
        }),
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
          <div key={i} className={`p-3 rounded-lg border-l-4 mb-3 ${
            speaker === 'Professor Hartwell' ? 'bg-blue-50 border-blue-400' :
            speaker === 'Blake' ? 'bg-red-50 border-red-400' :
            speaker === 'Drew' ? 'bg-green-50 border-green-400' :
            speaker === 'Casey' ? 'bg-purple-50 border-purple-400' :
            speaker === 'Avery' ? 'bg-orange-50 border-orange-400' : 'bg-gray-50 border-gray-400'
          }`}>
            <div className={`font-semibold mb-2 ${
              speaker === 'Professor Hartwell' ? 'text-blue-600' :
              speaker === 'Blake' ? 'text-red-600' :
              speaker === 'Drew' ? 'text-green-600' :
              speaker === 'Casey' ? 'text-purple-600' :
              speaker === 'Avery' ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {speaker}:
            </div>
            <div className="text-gray-800 leading-relaxed">
              {text}
            </div>
          </div>
        );
      }
    }
    
    return dialogueElements.length > 0 ? dialogueElements : <div className="text-gray-800">{cleanText}</div>;
  };

  const renderBanter = () => {
    if (!showBanter || !currentBanter) return null;

    return (
      <div>
        <div className="p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400 mb-3">
          <div className="font-semibold mb-2 text-blue-600">Professor Hartwell:</div>
          <div className="text-gray-800 leading-relaxed italic">
            {currentBanter.professorPause}
          </div>
        </div>
        {currentBanter.studentBanter.map((line, i) => (
          <div key={i} className={`p-3 rounded-lg border-l-4 mb-3 ${
            line.speaker === 'Blake' ? 'bg-red-50 border-red-400' :
            line.speaker === 'Drew' ? 'bg-green-50 border-green-400' :
            line.speaker === 'Casey' ? 'bg-purple-50 border-purple-400' :
            line.speaker === 'Avery' ? 'bg-orange-50 border-orange-400' : 'bg-gray-50 border-gray-400'
          }`}>
            <div className={`font-semibold mb-2 ${
              line.speaker === 'Blake' ? 'text-red-600' :
              line.speaker === 'Drew' ? 'text-green-600' :
              line.speaker === 'Casey' ? 'text-purple-600' :
              line.speaker === 'Avery' ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {line.speaker}:
            </div>
            <div className="text-gray-800 leading-relaxed italic">
              {line.text}
            </div>
          </div>
        ))}
        <div className="p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400 mb-3">
          <div className="font-semibold mb-2 text-blue-600">Professor Hartwell:</div>
          <div className="text-gray-800 leading-relaxed italic">
            {currentBanter.professorReturnPre} {readerName} {currentBanter.professorReturnPost} {userSubmittedText}
          </div>
        </div>
      </div>
    );
  };

  const nextBreakpoint = () => {
    if (!chapterData) return;
    if (currentBreakpoint < chapterData.breakpoints.length - 1) {
      setCurrentBreakpoint(currentBreakpoint + 1);
      setShowCallOnMe(false);
      setApiResponse('');
    }
  };

  const prevBreakpoint = () => {
    if (!chapterData) return;
    if (currentBreakpoint > 0) {
      setCurrentBreakpoint(currentBreakpoint - 1);
      setShowCallOnMe(false);
      setApiResponse('');
    }
  };

  if (!showSeminar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            The Social Code
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Interactive Seminar on Human Interdependence
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={readerName}
              onChange={(e) => setReaderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <button
              onClick={handleNameSubmit}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Join the Seminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return <div className="min-h-screen flex items-center justify-center">Loading chapter...</div>;
  }

  const currentBreakpointData = chapterData.breakpoints[currentBreakpoint];
  const isLastBreakpoint = currentBreakpoint === chapterData.breakpoints.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">The Social Code</h1>
            <select
              value={currentChapter}
              onChange={(e) => handleChapterChange(e.target.value)}
              className="bg-blue-700 text-white px-3 py-1 rounded border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {availableChapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
          <p className="text-blue-100">Professor Hartwell's Seminar • Welcome, {readerName}!</p>
          <p className="text-blue-200 text-sm mt-2">
            {currentBreakpointData.subheading}
          </p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6 min-h-[400px]">
            
            {/* Beautiful DialogueRenderer with speech bubble styling */}
            <DialogueRenderer dialogue={currentBreakpointData.dialogue} />

            {showBanter && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <span className="font-semibold text-yellow-800">Class discussion:</span>
                <div className="mt-2">
                  {renderBanter()}
                </div>
              </div>
            )}

            {apiResponse && (
              <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <span className="font-semibold text-green-800">Discussion continues:</span>
                <div className="mt-2">
                  {apiResponse}
                </div>
              </div>
            )}

            {showCallOnMe && (
              <div className="mt-4 space-y-3">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Type your comment or question here..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCallOnMe(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={prevBreakpoint}
              disabled={currentBreakpoint === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous Section
            </button>
            
            <span className="text-sm text-gray-500">
              Section {currentBreakpoint + 1} of {chapterData.breakpoints.length}
            </span>
            
            <div className="flex gap-3">
              {currentBreakpointData.hasCallOnMe && !showCallOnMe && !apiResponse && (
                <button
                  onClick={handleCallOnMe}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Call on me!
                </button>
              )}
              <button
                onClick={nextBreakpoint}
                disabled={isLastBreakpoint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLastBreakpoint ? 'Chapter Complete' : 'Next Section'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}