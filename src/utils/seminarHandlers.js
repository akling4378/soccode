// src/utils/seminarHandlers.js - FIXED: Clear banter state on navigation
export function createHandlers(state, setState) {
  const handleNameSubmit = () => {
    setState.setShowSeminar(true);
    setState.setCurrentBreakpoint(0); // Reset to first breakpoint
    
    // Scroll to top of page when entering seminar
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleChapterChange = (newChapter) => {
    setState.setCurrentChapter(newChapter);
    setState.setCurrentBreakpoint(0); // Reset to first breakpoint of new chapter
    setState.setChapterData(null);
    setState.setApiResponse('');
    setState.setShowCallOnMe(false);
    setState.setUserInput('');
    
    // Scroll to top when changing chapters
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleCallOnMe = () => {
    setState.setShowCallOnMe(true);
    setState.setApiResponse('');
  };

  const handleCancelInput = () => {
    setState.setShowCallOnMe(false);
    setState.setUserInput('');
  };

  const prevBreakpoint = () => {
    if (state.currentBreakpoint > 0) {
      setState.setCurrentBreakpoint(state.currentBreakpoint - 1);
      setState.setApiResponse('');
      setState.setShowCallOnMe(false);
      setState.setUserInput('');
      
      // FIXED: Clear banter state when navigating
      setState.setShowBanter(false);
      setState.setCurrentBanter(null);
      setState.setUserSubmittedText('');
      
      // Scroll to top when navigating breakpoints
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const nextBreakpoint = () => {
    if (state.chapterData && state.currentBreakpoint < state.chapterData.breakpoints.length - 1) {
      setState.setCurrentBreakpoint(state.currentBreakpoint + 1);
      setState.setApiResponse('');
      setState.setShowCallOnMe(false);
      setState.setUserInput('');
      
      // FIXED: Clear banter state when navigating
      setState.setShowBanter(false);
      setState.setCurrentBanter(null);
      setState.setUserSubmittedText('');
      
      // Scroll to top when navigating breakpoints
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleOpenOfficeHours = () => {
    setState.setShowOfficeHours(true);
  };

  const handleCloseOfficeHours = () => {
    setState.setShowOfficeHours(false);
  };

  return {
    handleNameSubmit,
    handleChapterChange,
    handleCallOnMe,
    handleCancelInput,
    prevBreakpoint,
    nextBreakpoint,
    handleOpenOfficeHours,
    handleCloseOfficeHours
  };
}