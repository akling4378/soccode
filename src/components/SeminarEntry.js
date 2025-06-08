// src/components/SeminarEntry.js
import React from 'react';

export default function SeminarEntry({ readerName, setReaderName, onSubmit }) {
  const handleSubmit = () => {
    if (readerName.trim()) {
      onSubmit();
    }
  };

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
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Join the Seminar
          </button>
        </div>
      </div>
    </div>
  );
}