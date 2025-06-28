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
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            The Social Code
          </h1>
          <p className="text-lg text-gray-700 mb-4 font-medium">
            An Interactive AI Seminar on Human Interdependence
          </p>
          <p className="text-xl text-blue-600 font-semibold mb-4">
            Socrates meets AI meets Steven Pinker and Jonathan Haidt—and YOU!
          </p>
          <p className="text-gray-700 mb-4">
            Get ready to dive deep into the most fascinating questions about human nature: Why do we cooperate? When do we compete? How do beliefs spread? What makes societies succeed or fail?
          </p>
          <p className="text-gray-700 mb-4">
            You're joining Professor Hartwell and four AI students, each with a distinct personality and intellectual style. This isn't passive reading—you're part of the conversation.
          </p>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">How to Explore:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Start anywhere:</strong> Jump into "Problems with Studies" or pick your chapter from the dropdown</li>
              <li>• <strong>Join the debate:</strong> Hit "Call on Me" at section breaks to ask questions or challenge ideas</li>
              <li>• <strong>Go deeper:</strong> Click "Office Hours" at chapter's end for one-on-one conversations with the professor</li>
              <li>• <strong>Expect pushback:</strong> These AI characters have strong opinions and won't just agree with you</li>
            </ul>
          </div>
          
          <p className="text-lg font-semibold text-gray-800 mb-6">
            Ready to test your thinking against some of the smartest ideas in social science?
          </p>
        </div>

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
            Jump Into the Discussion
          </button>
        </div>
      </div>
    </div>
  );
}