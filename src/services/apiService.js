// src/services/apiService.js
import { loadKnowledgeBase } from '../lib/dataLoader';

export async function callClaudeAPI({ 
  userInput, 
  readerName, 
  chapterData, 
  currentBreakpoint 
}) {
  const currentBreakpointData = chapterData.breakpoints[currentBreakpoint];
  const knowledgeBase = await loadKnowledgeBase();
  
  const globalInstructions = knowledgeBase.globalPromptInstructions || {
    baseContext: "You are in an interactive seminar called 'The Social Code' on human interdependence.",
    behaviorRules: [
      "Stay in character and maintain their personalities.",
      "Professor Hartwell should address the student by name when he first speaks.",
      "If the comment is off-topic, inappropriate, or disruptive, Drew should IMMEDIATELY interrupt and redirect the conversation."
    ],
    responseFormat: "Format your response as dialogue only.",
    continuationPrompt: "Continue the seminar discussion."
  };
  
  const chapterInstructions = chapterData.promptInstructions || {};
  
  const promptText = `${globalInstructions.baseContext}

CURRENT CHAPTER: ${chapterData.title}
CURRENT SECTION: ${currentBreakpointData.subheading}
${chapterInstructions.focus ? `FOCUS: ${chapterInstructions.focus}` : ''}

CONCEPTS:
${knowledgeBase.concepts.map(c => `- ${c.name}: ${c.elaboration}`).join('\n')}

CHARACTERS:
${Object.entries(knowledgeBase.characters).map(([name, info]) => 
  `- ${name}: ${info.temperament || info.role} - ${info.voice}`
).join('\n')}

A student named ${readerName} just said: "${userInput}"

RULES:
${globalInstructions.behaviorRules.join('\n')}

${globalInstructions.continuationPrompt}
${globalInstructions.responseFormat}`;

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: promptText }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}