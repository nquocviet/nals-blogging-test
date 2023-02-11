import { useEffect, useRef, useState } from 'react';

const useDebounce = (
  defaultValue: string | null,
  delay = 500
): [string | null, (value: string) => void] => {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);

  const clearTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };
  useEffect(() => clearTimeout, []);

  const debouncedSetValue = (newValue: string) => {
    clearTimeout();

    timeoutRef.current = window.setTimeout(() => {
      setValue(newValue);
    }, delay);
  };

  return [value, debouncedSetValue];
};

export default useDebounce;
