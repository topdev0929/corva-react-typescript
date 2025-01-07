import { useState } from 'react';

function useAnnotationsList() {
  const [isAnnotationsListOpened, setAnnotationsListOpened] = useState(false);
  const toggleAnnotationsList = () => setAnnotationsListOpened(!isAnnotationsListOpened);

  return { isAnnotationsListOpened, toggleAnnotationsList };
}

export default useAnnotationsList;
