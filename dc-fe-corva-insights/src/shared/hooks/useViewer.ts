import { useState } from 'react';

type ViewerData = { isOpen: false; defaultIndex: null } | { isOpen: true; defaultIndex: number };

const initialViewerData: ViewerData = { isOpen: false, defaultIndex: null };

export const useViewer = () => {
  const [viewerData, setViewerData] = useState<ViewerData>(initialViewerData);

  const openViewer = (index: number) => {
    setViewerData({ isOpen: true, defaultIndex: index });
  };

  const closeViewer = () => {
    setViewerData(initialViewerData);
  };

  return { viewerData, openViewer, closeViewer };
};
