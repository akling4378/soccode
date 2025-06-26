// src/hooks/useDataLoader.js
import { useEffect } from 'react';
import { loadChapterData, loadKnowledgeBase } from '../lib/dataLoader';

export function useDataLoader({
  currentChapter,
  setChapterData,
  setBanterData,
  setOfficeHoursPersonality,
  setCrossReferences,
  setSuggestedReadings
}) {
  useEffect(() => {
    async function loadData() {
      try {
        // Load chapter data
        const chapterData = await loadChapterData(currentChapter);
        setChapterData(chapterData);

        // Load knowledge base (includes banter)
        const knowledgeBase = await loadKnowledgeBase();
        
        // Load banter data
        const banterResponse = await fetch('/data/seminar-banter.JSON');
        if (banterResponse.ok) {
          const banterData = await banterResponse.json();
          setBanterData(banterData.banterDialogues);
        }

        // Load office hours personality
        const officeHoursResponse = await fetch('/data/office-hours-personality.JSON');
        if (officeHoursResponse.ok) {
          const officeHoursData = await officeHoursResponse.json();
          setOfficeHoursPersonality(officeHoursData);
        }

        // Load cross-references
        const crossRefResponse = await fetch('/data/cross-references.JSON');
        if (crossRefResponse.ok) {
          const crossRefData = await crossRefResponse.json();
          setCrossReferences(crossRefData.concepts || []);
        }

        // Load suggested readings
        const suggestedReadingsResponse = await fetch('/data/suggested-readings.JSON');
        if (suggestedReadingsResponse.ok) {
          const suggestedReadingsData = await suggestedReadingsResponse.json();
          setSuggestedReadings(suggestedReadingsData.suggestedReadings || []);
        }

      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    loadData();
  }, [currentChapter, setChapterData, setBanterData, setOfficeHoursPersonality, setCrossReferences, setSuggestedReadings]);
}