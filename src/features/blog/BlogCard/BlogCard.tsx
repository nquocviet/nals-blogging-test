import React, { useCallback } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { BlogType } from '@/types/blog.types';
import { formatDate } from '@/utils/format-date';
import styles from './BlogCard.module.css';
import { ROUTES } from '@/routes/constants';
import { AppDispatch } from '@/services/store';
import { deletePost, findPosts } from '@/services/post';

type TBlogCardProps = Pick<
  BlogType,
  'id' | 'title' | 'description' | 'slug' | 'thumbnail' | 'createdAt'
>;

const BlogCard: React.FunctionComponent<TBlogCardProps> = ({
  id,
  title,
  description,
  slug,
  thumbnail,
  createdAt
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelelePost = useCallback(async (id: number, title: string) => {
    const body = {
      id,
      title
    };

    dispatch(deletePost(body));
  }, []);

  return (
    <article>
      <Card className={styles['card']}>
        <img
          width={120}
          height={80}
          src={thumbnail}
          alt={title}
          className={styles['card-image']}
        />
        <Card.Body>
          <Card.Title className={styles['card-title']}>{title}</Card.Title>
          <Card.Text className={styles['card-widget']}>
            Published at: {formatDate(createdAt)}
          </Card.Text>
          <Card.Text className={styles['card-description']}>
            {description}
          </Card.Text>
          <Dropdown align="end" className={styles['card-dropdown']}>
            <Dropdown.Toggle aria-label="More options">
              <BsThreeDots size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles['card-dropdown-menu']}>
              <Dropdown.Item
                onClick={() =>
                  navigate(
                    generatePath(ROUTES.BLOG.EDIT, {
                      id: String(id),
                      slug
                    })
                  )
                }>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelelePost(id, title)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
        <Link
          to={generatePath(ROUTES.BLOG.DETAILS, {
            id: String(id),
            slug
          })}
          className={styles['card-link']}
          aria-label={`Read more about ${title}`}
        />
      </Card>
    </article>
  );
};

export default BlogCard;
