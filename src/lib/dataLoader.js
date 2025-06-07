export async function loadChapterData(chapterId) {
  try {
    const response = await fetch(`/data/chapters/${chapterId}.JSON`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Chapter load failed:', error);
  }
  
  return {
    id: chapterId,
    title: "Chapter Coming Soon",
    breakpoints: [{
      id: 'placeholder', 
      subheading: 'Under Development',
      dialogue: [{ speaker: 'Professor Hartwell', text: 'Coming soon!' }],
      hasCallOnMe: false
    }]
  };
}

export async function loadKnowledgeBase() {
  try {
    const response = await fetch('/data/seminar-knowledge-base.JSON');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Knowledge base load failed:', error);
  }
  
  return {
    concepts: [],
    characters: {
      "Professor Hartwell": { role: "Teacher", voice: "Scholarly" },
      "Blake": { temperament: "Skeptical", voice: "Direct" },
      "Drew": { temperament: "Practical", voice: "Focused" },
      "Casey": { temperament: "Historical", voice: "Thoughtful" }, 
      "Avery": { temperament: "Systems", voice: "Analytical" }
    }
  };
}