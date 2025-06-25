// src/components/OfficeHoursInput.js - Input area (45 lines)
import React from 'react';

export default function OfficeHoursInput({ 
  currentInput, 
  setCurrentInput, 
  onSubmit, 
  isLoading, 
  exchangesRemaining, 
  onClose 
}) {
  const MAX_EXCHANGES = 5;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t p-4">
      {exchangesRemaining > 0 ? (
        <div className="space-y-3">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            placeholder="Ask a question about this chapter or share your thoughts..."
            disabled={isLoading}
            maxLength={300}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentInput.length}/300 characters
              {exchangesRemaining <= 2 && (
                <span className="ml-2 text-orange-600">
                  ({exchangesRemaining} exchanges remaining)
                </span>
              )}
            </div>
            
            <button
              onClick={onSubmit}
              disabled={!currentInput.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-700 mb-3">
            You've reached the maximum of {MAX_EXCHANGES} exchanges for this session.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Seminar
          </button>
        </div>
      )}
    </div>
  );
}