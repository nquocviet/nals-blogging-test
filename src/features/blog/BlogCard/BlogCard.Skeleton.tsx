import React from 'react';
import { Card } from 'react-bootstrap';
import { Skeleton } from '@/components';
import styles from './BlogCard.module.css';

const BlogCardSkeleton: React.FunctionComponent = () => {
  return (
    <article>
      <Card className={styles['card']}>
        <Skeleton
          width={120}
          height={80}
          variant="rounded"
          className={styles['card-image']}
        />
        <Card.Body>
          <Skeleton width="80%" variant="text" className="h4" />
          <Skeleton
            width="60%"
            variant="text"
            className={styles['card-widget']}
          />
          <Skeleton width="100%" variant="text" />
          <Skeleton width="100%" variant="text" />
          <Skeleton width="30%" variant="text" />
        </Card.Body>
      </Card>
    </article>
  );
};

export default BlogCardSkeleton;
