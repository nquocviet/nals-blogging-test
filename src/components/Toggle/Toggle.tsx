import React, { ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Toggle.module.css';

type ToggleProps = React.HTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  checked: boolean;
  onChange:
    | (() => void)
    | ((event: React.ChangeEvent<HTMLInputElement>) => void);
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className, checked, onChange, ...rest }, ref) => {
    return (
      <div className={clsx(styles['toggle-container'], className)}>
        <label className={styles['toggle-wrapper']}>
          <input
            type="checkbox"
            className={styles['toggle-input']}
            onChange={onChange}
            checked={checked}
            ref={ref}
            {...rest}
          />
          <div className={styles['toggle']}>
            <div
              className={clsx(
                styles['toggle-switch'],
                checked && styles['toggle-switch-active']
              )}></div>
          </div>
        </label>
        {label && (
          <div>
            {label && <p className={styles['toggle-label']}>{label}</p>}
            {description && (
              <p className={styles['toggle-description']}>{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
