// src/components/OfficeHours.js - Fixed with readerName and suggested readings
import React, { useState, useEffect } from 'react';
import OfficeHoursHeader from './OfficeHoursHeader';
import ConversationArea from './ConversationArea';
import OfficeHoursInput from './OfficeHoursInput';
import { useOfficeHours } from '../hooks/useOfficeHours';

export default function OfficeHours({ 
  isOpen, 
  chapterTitle, 
  chapterConcepts, 
  suggestedReadings,
  officeHoursPersonality, 
  readerName, 
  onClose 
}) {
  const {
    conversation,
    currentInput,
    setCurrentInput,
    isLoading,
    exchangesUsed,
    exchangesRemaining,
    handleSubmitComment,
    resetConversation
  } = useOfficeHours(chapterTitle, chapterConcepts, suggestedReadings, officeHoursPersonality);

  // Reset and scroll when opened
  useEffect(() => {
    if (isOpen) {
      resetConversation();
      setTimeout(() => {
        document.getElementById('office-hours-component')?.scrollIntoView({ 
          behavior: 'smooth', block: 'start' 
        });
      }, 100);
    }
  }, [isOpen, resetConversation]);

  if (!isOpen) return null;

  return (
    <div id="office-hours-component" className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl mt-8 overflow-hidden flex flex-col" style={{ height: '600px' }}>
      <OfficeHoursHeader 
        chapterTitle={chapterTitle}
        exchangesUsed={exchangesUsed}
        onClose={onClose}
      />
      
      <ConversationArea 
        conversation={conversation}
        chapterTitle={chapterTitle}
        isLoading={isLoading}
        readerName={readerName}
      />
      
      <OfficeHoursInput
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        onSubmit={handleSubmitComment}
        isLoading={isLoading}
        exchangesRemaining={exchangesRemaining}
        onClose={onClose}
      />
    </div>
  );
}