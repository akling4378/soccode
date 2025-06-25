// src/hooks/useDataLoader.js
import { useEffect } from 'react';
import { chaptersConfig } from '../data/chapters-config';

export function useDataLoader({ 
  currentChapter, 
  setChapterData, 
  setBanterData,
  setOfficeHoursPersonality,
  setCrossReferences 
}) {
  
  useEffect(() => {
    loadChapterData(currentChapter);
    loadBanterData();
    loadOfficeHoursData(); // Load once when component mounts
  }, [currentChapter]);

  const loadChapterData = async (chapterId) => {
    try {
      const chapterConfig = chaptersConfig.find(ch => ch.id === chapterId);
      if (!chapterConfig) {
        throw new Error('Chapter config not found');
      }
      
      const response = await fetch(`/data/chapters/${chapterConfig.filename}`);
      if (!response.ok) throw new Error('Chapter not found');
      const data = await response.json();
      setChapterData(data);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setChapterData({
        id: chapterId,
        title: `${chapterId.replace('-', ' ')} (Coming Soon)`,
        description: "Chapter under development",
        breakpoints: [{
          id: 'placeholder',
          subheading: 'Chapter Under Development',
          dialogue: [{
            speaker: 'Professor Hartwell',
            text: `The ${chapterId.replace('-', ' ')} chapter is being developed. Please check back soon!`
          }],
          hasCallOnMe: false
        }]
      });
    }
  };

  const loadBanterData = async () => {
    try {
      const response = await fetch('/data/seminar-banter.JSON');
      if (!response.ok) throw new Error('Banter data not found');
      const data = await response.json();
      setBanterData(data);
    } catch (error) {
      console.error('Error loading banter data:', error);
    }
  };

  const loadOfficeHoursData = async () => {
    // Load office hours personality
    try {
      const personalityResponse = await fetch('/data/office-hours-personality.JSON');
      if (!personalityResponse.ok) throw new Error('Office hours personality not found');
      const personalityData = await personalityResponse.json();
      setOfficeHoursPersonality(personalityData);
    } catch (error) {
      console.error('Error loading office hours personality:', error);
      setOfficeHoursPersonality(''); // Fallback to empty string
    }

    // Load cross-references
    try {
      const crossRefResponse = await fetch('/data/cross-references.JSON');
      if (!crossRefResponse.ok) throw new Error('Cross-references not found');
      const crossRefData = await crossRefResponse.json();
      setCrossReferences(crossRefData.concepts || []);
    } catch (error) {
      console.error('Error loading cross-references:', error);
      setCrossReferences([]); // Fallback to empty array
    }
  };

  return { loadChapterData, loadBanterData, loadOfficeHoursData };
}