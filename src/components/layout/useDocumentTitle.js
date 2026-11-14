// Sets the browser tab title for a page, e.g. "About · Cardio Explorer".
import { useEffect } from 'react';

export const SITE_NAME = 'Cardio Explorer';

export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
}
