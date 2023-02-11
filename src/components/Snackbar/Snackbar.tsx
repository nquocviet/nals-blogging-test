import React, { forwardRef, useState, ReactNode } from 'react';
import { BsX } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useInterval } from '@/hooks';
import { removeSnackbar } from '@/services/snackbar';
import styles from './Snackbar.module.css';

type TSnackbarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> & {
  id: number;
  message: ReactNode;
  open?: boolean;
  autoHideDuration?: number;
  className?: string;
};

const Snackbar = forwardRef<HTMLDivElement, TSnackbarProps>(
  ({ id, message, open, autoHideDuration = 4000, className, ...rest }, ref) => {
    const dispatch = useDispatch();
    const [timer, setTimer] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    useInterval(() => {
      if (!open && !autoHideDuration) return;

      if (!pause) {
        setTimer((prevState) => prevState + 1);

        if (autoHideDuration && timer >= autoHideDuration / 1000) {
          dispatch(removeSnackbar(id));
        }
      }
    });

    return (open && (
      <div
        className={styles['snackbar']}
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
        ref={ref}
        {...rest}>
        <div className={styles['snackbar-message']}>{message}</div>
        <span
          role="button"
          className={styles['snackbar-action']}
          onClick={() => dispatch(removeSnackbar(id))}>
          <BsX size={20} />
        </span>
      </div>
    )) as JSX.Element;
  }
);

Snackbar.displayName = 'Snackbar';

export default Snackbar;
