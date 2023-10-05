import { useEffect } from "react";

const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return document.title;
};

export default useDocumentTitle;
