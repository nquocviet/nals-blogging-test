import React from 'react';
import { BlogCard } from '..';
import { BlogType } from '@/types/blog.types';
import styles from './BlogList.module.css';
import { BlogCardSkeleton } from '../BlogCard';

type TBlogListProps = {
  posts: BlogType[];
  loading: boolean;
};

const BlogList: React.FunctionComponent<TBlogListProps> = ({
  posts,
  loading
}) => {
  if (!posts?.length && !loading) {
    return (
      <div className={styles['empty-state']}>There is no posts available</div>
    );
  }

  return (
    <section className={styles['blog-list']}>
      {loading
        ? [...Array(5)].map((_, index) => <BlogCardSkeleton key={index} />)
        : posts.map((post) => <BlogCard key={post.id} {...post} />)}
    </section>
  );
};

export default BlogList;
