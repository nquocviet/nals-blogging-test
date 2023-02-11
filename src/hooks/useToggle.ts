import { useCallback, useEffect, useState } from 'react';

const useToggle = (
  initialState = false,
  reassignOnStateChange = true
): [boolean, (state?: boolean) => void] => {
  const [state, setState] = useState<boolean>(initialState);

  useEffect(() => {
    if (reassignOnStateChange) {
      setState(initialState);
    }
  }, [initialState]);

  const toggle = useCallback(
    (state?: boolean): void =>
      state !== undefined
        ? setState(state)
        : setState((prevState) => !prevState),
    []
  );

  return [state, toggle];
};

export default useToggle;
