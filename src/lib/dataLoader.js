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
    const knowledgeBaseResponse = await fetch('/data/seminar-knowledge-base.JSON');
    const crossReferencesResponse = await fetch('/data/cross-references.JSON');
    
    if (knowledgeBaseResponse.ok && crossReferencesResponse.ok) {
      const knowledgeBase = await knowledgeBaseResponse.json();
      const crossReferences = await crossReferencesResponse.json();
      
      // Merge the data
      return {
        ...knowledgeBase,
        concepts: crossReferences.concepts || []
      };
    }
  } catch (error) {
    console.log('Knowledge base load failed:', error);
  }
  
  return {
    globalPromptInstructions: {
      baseContext: "You are in an interactive seminar called 'The Social Code' on human interdependence.",
      behaviorRules: [
        "Stay in character and maintain their personalities.",
        "Professor Hartwell should address the student by name when he first speaks.",
        "If the comment is off-topic, inappropriate, or disruptive, Drew should IMMEDIATELY interrupt and redirect the conversation."
      ],
      responseFormat: "Format your response as dialogue only.",
      continuationPrompt: "Continue the seminar discussion."
    },
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