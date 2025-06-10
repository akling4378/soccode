// src/hooks/useDataLoader.js
import { useEffect } from 'react';
import { chaptersConfig } from '../data/chapters-config';

export function useDataLoader({ currentChapter, setChapterData, setBanterData }) {
  
  useEffect(() => {
    loadChapterData(currentChapter);
    loadBanterData();
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

  return { loadChapterData, loadBanterData };
}