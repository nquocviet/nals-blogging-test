import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RawDraftContentState } from 'draft-js';
import { findPostById, selectorPostState } from '@/services/post';
import { AppDispatch } from '@/services/store';
import { Button, RichEditorReadOnly, Skeleton } from '@/components';
import { useWindowScroll } from '@/hooks';
import { formatDate } from '@/utils/format-date';
import styles from './BlogDetails.module.css';
import { OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap';
import { BsArrowUpShort } from 'react-icons/bs';

const OFFSET_TOP = 100;

const BlogDetailsPage: React.FunctionComponent = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { post, loading } = useSelector(selectorPostState);
  const [backToTop, setBackToTop] = useState(false);
  const [position, scrollTo] = useWindowScroll();
  const id = params.id as string;

  useEffect(() => {
    if (position.y > OFFSET_TOP) {
      setBackToTop(true);
    } else {
      setBackToTop(false);
    }
  }, [position]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (id && !loading) {
      dispatch(
        findPostById({
          id,
          signal
        })
      );
    }

    return () => {
      controller.abort();
    };
  }, [params]);

  if (loading || !post) {
    return (
      <>
        <div className={styles['title']}>
          <Skeleton variant="text" width="100%" centered />
          <Skeleton variant="text" width="60%" centered />
        </div>
        <Skeleton
          variant="text"
          width="40%"
          className={styles['date']}
          centered
        />
        {[...Array(4)].map((_, index) => (
          <div key={index} className={styles['description']}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </>
    );
  }

  const { title, description, content, createdAt, updatedAt } = post;

  return (
    <>
      <h1 className={styles['title']}>{title}</h1>
      <p className={styles['date']}>
        Published on: {formatDate(createdAt)}{' '}
        {createdAt !== updatedAt && <>• Updated on {formatDate(updatedAt)}</>}
      </p>
      <p className={styles['description']}>{description}</p>
      <div className={styles['content']}>
        <RichEditorReadOnly rawContent={content as RawDraftContentState} />
      </div>
      {backToTop && (
        <OverlayTrigger
          placement="top"
          overlay={(props: TooltipProps) => (
            <Tooltip {...props}>Back to top</Tooltip>
          )}>
          <Button
            className={styles['back-to-top']}
            onClick={() => scrollTo({ x: 0, y: 0 })}>
            <BsArrowUpShort size={28} />
          </Button>
        </OverlayTrigger>
      )}
    </>
  );
};

export default BlogDetailsPage;
