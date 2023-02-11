import clsx from 'clsx';
import React, { ReactNode, forwardRef } from 'react';
import styles from './Button.module.css';

type TButtonTypes = 'button' | 'submit' | 'reset';

type TButtonBaseProps = {
  children: ReactNode | ReactNode[];
  type?: TButtonTypes;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export type TButtonAsButton = TButtonBaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof TButtonBaseProps
  > & {
    as?: 'button';
  };

export type TButtonAsLabel = TButtonBaseProps &
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, keyof TButtonBaseProps> & {
    as: 'label';
  };

export type TButtonProps = TButtonAsButton | TButtonAsLabel;

const Button = forwardRef<HTMLButtonElement | HTMLLabelElement, TButtonProps>(
  (
    {
      children,
      type = 'button',
      color = 'primary',
      leading,
      trailing,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    if (rest.as === 'label') {
      return (
        <label
          role="button"
          className={clsx(styles['button'], className)}
          onClick={() => onClick && onClick()}
          ref={ref as React.ForwardedRef<HTMLLabelElement>}
          {...rest}>
          {leading && leading}
          {children}
          {trailing && trailing}
        </label>
      );
    }

    return (
      <button
        className={clsx(styles['button'], className)}
        type={type}
        onClick={() => onClick && onClick()}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...rest}>
        {leading && leading}
        {children}
        {trailing && trailing}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
