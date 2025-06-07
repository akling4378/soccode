export const availableChapters = [
  { id: 'correlation', title: 'Understanding Correlation' },
  { id: 'evo', title: 'Evolutionary Psychology' },
  { id: 'other', title: 'Other chapters (coming soon)' }
];

export const isPlaceholderChapter = (chapterId) => {
  return chapterId === 'other';
};

export const getPlaceholderMessage = (chapterId) => {
  if (chapterId === 'other') {
    return 'Other chapters coming soon!';
  }
  return null;
};