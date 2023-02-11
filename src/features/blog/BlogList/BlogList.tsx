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
  return (
    <section className={styles['blog-list']}>
      {loading ? (
        [...Array(5)].map((_, index) => <BlogCardSkeleton key={index} />)
      ) : posts?.length ? (
        posts.map((post) => <BlogCard key={post.id} {...post} />)
      ) : (
        <div className={styles['empty-state']}>There is no posts available</div>
      )}
    </section>
  );
};

export default BlogList;
