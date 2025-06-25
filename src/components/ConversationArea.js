// src/components/ConversationArea.js - Fixed with DialogueRenderer
import React, { useEffect, useRef } from 'react';
import DialogueRenderer from './DialogueRenderer';

export default function ConversationArea({ conversation, chapterTitle, isLoading, readerName }) {
  const conversationEndRef = useRef(null);

  // Auto-scroll when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ 
      behavior: 'smooth', block: 'end' 
    });
  }, [conversation, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">        
      {conversation.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-2">Welcome to office hours!</p>
          <p className="text-sm">Ask me anything about {chapterTitle} or related concepts.</p>
        </div>
      )}
      
      {conversation.map((message, index) => (
        <div key={index}>
          {message.speaker === 'Professor Hartwell' ? (
            // Use DialogueRenderer for Professor responses to enable cross-references
            <DialogueRenderer 
              speaker={message.speaker}
              text={message.text}
            />
          ) : (
            // Simple display for User messages
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <strong className="text-blue-800">{readerName}:</strong>
              <div className="mt-1 text-gray-800">{message.text}</div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="p-3 bg-gray-100 rounded-lg">
          <span className="text-gray-600">Professor Hartwell is thinking...</span>
        </div>
      )}

      <div ref={conversationEndRef} />
    </div>
  );
}