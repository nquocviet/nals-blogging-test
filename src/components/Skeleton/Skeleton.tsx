import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

type TSkeletonVariants = 'text' | 'rectangular' | 'rounded';

type TSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: TSkeletonVariants;
  width?: number | string;
  height?: number | string;
  centered?: boolean;
  className?: string;
};

const Skeleton = forwardRef<HTMLDivElement, TSkeletonProps>(
  (
    {
      variant = 'rectangular',
      width,
      height,
      centered,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={clsx(
          styles['skeleton'],
          styles[`skeleton-${variant}`],
          centered && styles['skeleton-centered'],
          className
        )}
        ref={ref}
        style={{
          ...(width && { width }),
          ...(height && { height }),
          ...style
        }}
        {...rest}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
