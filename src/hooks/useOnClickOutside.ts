import { useEffect, RefObject } from 'react';

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = () => {
      const element = ref?.current;
      if (!element || element.contains((event?.target as Node) || null)) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
