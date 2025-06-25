// src/utils/dialogueParser.js
export function parseDialogue(text) {
  let cleanText = text.replace(/This sets up.*?$/gm, '').replace(/The discussion.*?$/gm, '').trim();
  const speakerPattern = /^(Professor Hartwell|Blake|Drew|Casey|Avery):\s*/gm;
  const parts = cleanText.split(speakerPattern);
  const dialogueData = [];
  
  for (let i = 1; i < parts.length; i += 2) {
    const speaker = parts[i];
    const text = parts[i + 1]?.trim();
    
    if (speaker && text) {
      dialogueData.push({
        speaker: speaker,
        text: text
      });
    }
  }
  
  // If no structured dialogue found, return the cleaned text as a single Professor Hartwell response
  return dialogueData.length > 0 ? dialogueData : [{ 
    speaker: 'Professor Hartwell', 
    text: cleanText 
  }];
}