import { useEffect } from 'react';

export const SITE_TITLE =
  'Imagegraphy - High-end Commercial Architectural, Real-Estate and Product Photography.';

const useDocumentTitle = (pageName) => {
  useEffect(() => {
    document.title = pageName ? `${pageName} | ${SITE_TITLE}` : SITE_TITLE;
  }, [pageName]);
};

export default useDocumentTitle;
