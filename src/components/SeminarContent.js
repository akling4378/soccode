// src/components/SeminarContent.js
import React from 'react';
import DialogueRenderer from './DialogueRenderer';
import BanterDisplay from './BanterDisplay';
import UserInteraction from './UserInteraction';
import NavigationControls from './NavigationControls';

export default function SeminarContent({
  currentBreakpointData,
  showBanter,
  currentBanter,
  readerName,
  userSubmittedText,
  apiResponse,
  showCallOnMe,
  userInput,
  setUserInput,
  onSubmitResponse,
  onCancelInput,
  currentBreakpoint,
  totalBreakpoints,
  onPrevBreakpoint,
  onNextBreakpoint,
  onCallOnMe
}) {
  return (
    <div className="p-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6 min-h-[400px]">
        {/* Main Dialogue Display */}
        <div className="space-y-4 mb-4">
          {currentBreakpointData.dialogue.map((dialogueItem, index) => (
            <DialogueRenderer 
              key={index} 
              speaker={dialogueItem.speaker} 
              text={dialogueItem.text} 
            />
          ))}
        </div>

        {/* Banter During API Wait */}
        <BanterDisplay 
          showBanter={showBanter}
          currentBanter={currentBanter}
          readerName={readerName}
          userSubmittedText={userSubmittedText}
        />

        {/* API Response Display */}
        {apiResponse && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
            <span className="font-semibold text-green-800">Discussion continues:</span>
            <div className="mt-2">
              {apiResponse}
            </div>
          </div>
        )}

        {/* User Input Interface */}
        <UserInteraction 
          showCallOnMe={showCallOnMe}
          userInput={userInput}
          setUserInput={setUserInput}
          onSubmit={onSubmitResponse}
          onCancel={onCancelInput}
        />
      </div>
      
      {/* Navigation Controls */}
      <NavigationControls 
        currentBreakpoint={currentBreakpoint}
        totalBreakpoints={totalBreakpoints}
        onPrevious={onPrevBreakpoint}
        onNext={onNextBreakpoint}
        hasCallOnMe={currentBreakpointData.hasCallOnMe}
        showCallOnMe={showCallOnMe}
        apiResponse={apiResponse}
        onCallOnMe={onCallOnMe}
      />
    </div>
  );
}