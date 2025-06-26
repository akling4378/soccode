// src/app/page.tsx
"use client"
import React from 'react';
import { chaptersConfig } from '../data/chapters-config';
import { useSeminarState } from '../hooks/useSeminarState';
import { useDataLoader } from '../hooks/useDataLoader';
import { useBanter } from '../hooks/useBanter';
import { useSubmitHandler } from '../hooks/useSubmitHandler';
import { createHandlers } from '../utils/seminarHandlers';
import SeminarEntry from '../components/SeminarEntry';
import SeminarHeader from '../components/SeminarHeader';
import SeminarContent from '../components/SeminarContent';
import OfficeHours from '../components/OfficeHours';

export default function SeminarPage() {
  // All state management
  const state = useSeminarState();

  // Data loading - now includes suggested readings
  useDataLoader({
    currentChapter: state.currentChapter,
    setChapterData: state.setChapterData,
    setBanterData: state.setBanterData,
    setOfficeHoursPersonality: state.setOfficeHoursPersonality,
    setCrossReferences: state.setCrossReferences,
    setSuggestedReadings: state.setSuggestedReadings
  });

  // Banter management
  const { startBanter } = useBanter({
    banterData: state.banterData,
    setCurrentBanter: state.setCurrentBanter,
    setShowBanter: state.setShowBanter
  });

  // Submit handling
  const { handleSubmitResponse } = useSubmitHandler({
    state,
    setState: state,
    startBanter
  });

  // Event handlers
  const handlers = createHandlers(state, state);

  // Filter cross-references for current chapter
  const chapterConcepts = state.crossReferences.filter(
    concept => concept.homeChapter === state.currentChapter
  );

  // Filter suggested readings for current chapter
  const chapterSuggestedReadings = state.suggestedReadings.filter(
    reading => reading.chapter === state.currentChapter
  );

  // Render entry screen
  if (!state.showSeminar) {
    return (
      <SeminarEntry 
        readerName={state.readerName}
        setReaderName={state.setReaderName}
        onSubmit={handlers.handleNameSubmit}
      />
    );
  }

  // Render loading screen
  if (!state.chapterData) {
    return <div className="min-h-screen flex items-center justify-center">Loading chapter...</div>;
  }

  const currentBreakpointData = state.chapterData.breakpoints[state.currentBreakpoint];

  // Render main seminar interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <SeminarHeader 
          currentChapter={state.currentChapter}
          onChapterChange={handlers.handleChapterChange}
          readerName={state.readerName}
          currentBreakpointData={currentBreakpointData}
          availableChapters={chaptersConfig}
        />
        
        <SeminarContent 
          currentBreakpointData={currentBreakpointData}
          showBanter={state.showBanter}
          currentBanter={state.currentBanter}
          readerName={state.readerName}
          userSubmittedText={state.userSubmittedText}
          apiResponse={state.apiResponse}
          showCallOnMe={state.showCallOnMe}
          userInput={state.userInput}
          setUserInput={state.setUserInput}
          onSubmitResponse={handleSubmitResponse}
          onCancelInput={handlers.handleCancelInput}
          currentBreakpoint={state.currentBreakpoint}
          totalBreakpoints={state.chapterData.breakpoints.length}
          onPrevBreakpoint={handlers.prevBreakpoint}
          onNextBreakpoint={handlers.nextBreakpoint}
          onCallOnMe={handlers.handleCallOnMe}
          onOpenOfficeHours={handlers.handleOpenOfficeHours}
        />

        {/* Office Hours Modal */}
        <OfficeHours 
          isOpen={state.showOfficeHours}
          chapterTitle={state.chapterData?.title}
          chapterConcepts={chapterConcepts}
          suggestedReadings={chapterSuggestedReadings}
          officeHoursPersonality={state.officeHoursPersonality}
          readerName={state.readerName}
          onClose={handlers.handleCloseOfficeHours}
        />
      </div>
    </div>
  );
}