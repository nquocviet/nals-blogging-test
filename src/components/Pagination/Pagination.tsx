import clsx from 'clsx';
import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import styles from './Pagination.module.css';

type TPaginationProps = {
  currentPage: number;
  pageCount: number;
  offset?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onChange: (page: number) => void;
};

const getRange = (
  currentPage: number,
  totalPages: number,
  offset: number
): number[] | (number | string)[] => {
  const offsetNumber =
    currentPage <= offset || currentPage > totalPages - offset
      ? offset
      : offset - 1;
  const numbersList: number[] = [];
  const numbersListWithDots: (number | string)[] = [];

  if (totalPages <= 1 || totalPages === undefined) return [1];

  numbersList.push(1);
  for (
    let i = currentPage - offsetNumber;
    i <= currentPage + offsetNumber;
    i++
  ) {
    if (i < totalPages && i > 1) {
      numbersList.push(i);
    }
  }
  numbersList.push(totalPages);

  numbersList.reduce((accumulator, currentValue) => {
    if (accumulator === 1) {
      numbersListWithDots.push(accumulator);
    }
    if (currentValue - accumulator !== 1) {
      numbersListWithDots.push('...');
    }
    numbersListWithDots.push(currentValue);

    return currentValue;
  });

  return numbersListWithDots;
};

const Pagination: React.FunctionComponent<TPaginationProps> = ({
  currentPage,
  pageCount,
  offset = 3,
  hasPreviousPage,
  hasNextPage,
  onChange
}) => {
  return (
    <BootstrapPagination className={styles['pagination']}>
      <BootstrapPagination.Prev
        className={clsx(
          styles['pagination-item'],
          styles['pagination-item-default'],
          !hasPreviousPage && styles['pagination-item-disabled']
        )}
        onClick={() => hasPreviousPage && onChange(currentPage - 1)}
      />
      {getRange(currentPage, pageCount, offset).map((page) => {
        const active = currentPage === page;

        if (typeof page === 'string') {
          return (
            <BootstrapPagination.Item
              key={page}
              className={clsx(
                styles['pagination-item'],
                styles['pagination-item-default']
              )}>
              {page}
            </BootstrapPagination.Item>
          );
        }

        return (
          <BootstrapPagination.Item
            key={page}
            active={active}
            className={clsx(
              styles['pagination-item'],
              active
                ? styles['pagination-item-active']
                : styles['pagination-item-default']
            )}
            onClick={() => !active && onChange(page)}>
            {page}
          </BootstrapPagination.Item>
        );
      })}
      <BootstrapPagination.Next
        className={clsx(
          styles['pagination-item'],
          styles['pagination-item-default'],
          !hasNextPage && styles['pagination-item-disabled']
        )}
        onClick={() => hasNextPage && onChange(currentPage + 1)}
      />
    </BootstrapPagination>
  );
};

export default Pagination;
