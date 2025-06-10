// src/utils/seminarHandlers.js
import { chaptersConfig } from '../data/chapters-config';

export function createHandlers(state, setState) {
  const {
    setShowSeminar,
    setCurrentChapter,
    setCurrentBreakpoint,
    setShowCallOnMe,
    setApiResponse,
    chapterData
  } = state;

  const handleNameSubmit = () => setShowSeminar(true);

  const handleChapterChange = (chapterId) => {
    const chapterExists = chaptersConfig.some(ch => ch.id === chapterId);
    if (!chapterExists) {
      alert('Chapter coming soon!');
      return;
    }
    
    setCurrentChapter(chapterId);
    setCurrentBreakpoint(0);
    setShowCallOnMe(false);
    setApiResponse('');
  };

  const handleCallOnMe = () => setShowCallOnMe(true);

  const handleCancelInput = () => setShowCallOnMe(false);

  const nextBreakpoint = () => {
    if (!chapterData || state.currentBreakpoint >= chapterData.breakpoints.length - 1) return;
    setCurrentBreakpoint(state.currentBreakpoint + 1);
    setShowCallOnMe(false);
    setApiResponse('');
    
    // Fix: Scroll to top when navigating to next section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevBreakpoint = () => {
    if (!chapterData || state.currentBreakpoint <= 0) return;
    setCurrentBreakpoint(state.currentBreakpoint - 1);
    setShowCallOnMe(false);
    setApiResponse('');
    
    // Fix: Scroll to top when navigating to previous section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    handleNameSubmit,
    handleChapterChange,
    handleCallOnMe,
    handleCancelInput,
    nextBreakpoint,
    prevBreakpoint
  };
}