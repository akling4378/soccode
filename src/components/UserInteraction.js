// src/components/UserInteraction.js
import React from 'react';

export default function UserInteraction({ 
  showCallOnMe, 
  userInput, 
  setUserInput, 
  onSubmit, 
  onCancel 
}) {
  if (!showCallOnMe) return null;

  return (
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
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}