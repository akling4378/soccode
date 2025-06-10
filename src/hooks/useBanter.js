// src/hooks/useBanter.js

export function useBanter({ banterData, setCurrentBanter, setShowBanter }) {
  
  const startBanter = () => {
    if (!banterData?.banterDialogues) return;
    
    const randomIndex = Math.floor(Math.random() * banterData.banterDialogues.length);
    const selectedBanter = banterData.banterDialogues[randomIndex];
    
    setCurrentBanter(selectedBanter);
    setShowBanter(true);
  };

  return { startBanter };
}