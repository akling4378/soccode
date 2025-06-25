// src/components/NavigationControls.js
import React from 'react';

export default function NavigationControls({
  currentBreakpoint,
  totalBreakpoints,
  onPrevious,
  onNext,
  hasCallOnMe,
  showCallOnMe,
  apiResponse,
  onCallOnMe,
  onOpenOfficeHours // New prop
}) {
  const isFirstBreakpoint = currentBreakpoint === 0;
  const isLastBreakpoint = currentBreakpoint >= totalBreakpoints - 1;
  const showCallOnMeButton = hasCallOnMe && !showCallOnMe && !apiResponse;

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={isFirstBreakpoint}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous Section
      </button>
      
      <span className="text-sm text-gray-500">
        Section {currentBreakpoint + 1} of {totalBreakpoints}
      </span>
      
      <div className="flex gap-3">
        {showCallOnMeButton && (
          <button
            onClick={onCallOnMe}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Call on me!
          </button>
        )}
        
        {isLastBreakpoint && (
          <button
            onClick={onOpenOfficeHours}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Office Hours
          </button>
        )}
        
        <button
          onClick={onNext}
          disabled={isLastBreakpoint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLastBreakpoint ? 'Chapter Complete' : 'Next Section'}
        </button>
      </div>
    </div>
  );
}