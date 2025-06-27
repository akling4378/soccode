// src/hooks/useBanter.js
export function useBanter({ banterData, setCurrentBanter, setShowBanter }) {
  
  const startBanter = () => {
    if (!banterData || banterData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * banterData.length);
    const selectedBanter = banterData[randomIndex];
    
    setCurrentBanter(selectedBanter);
    setShowBanter(true);
  };

  return { startBanter };
}