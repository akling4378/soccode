// src/components/OfficeHoursHeader.js - Header component (25 lines)
import React from 'react';

export default function OfficeHoursHeader({ chapterTitle, exchangesUsed, onClose }) {
  const MAX_EXCHANGES = 5;
  
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">Office Hours with Professor Hartwell</h2>
        <p className="text-blue-100 text-sm">{chapterTitle}</p>
      </div>
      <div className="text-right">
        <div className="text-sm text-blue-100">
          Exchanges: {exchangesUsed}/{MAX_EXCHANGES}
        </div>
        <button
          onClick={onClose}
          className="mt-1 text-blue-100 hover:text-white text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

