import { useEffect } from "react";

const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | Forsty` : "Forsty";
  }, [title]);
};

export default usePageTitle;
