import React, { useEffect } from 'react';
import { BlogForm } from '@/features/blog';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findPostById, selectorPostState } from '@/services/post';
import { AppDispatch } from '@/services/store';
import { addSnackbar } from '@/services/snackbar';
import { BlogDataType } from '@/types/blog.types';

const defaultValues = {
  title: '',
  description: '',
  thumbnail: '',
  content: {},
  published: true
};

const AddEditBlogPage: React.FunctionComponent = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { post, loading } = useSelector(selectorPostState);
  const isEditing = !!Object.keys(params).length;
  const id = params.id as string;

  useEffect(() => {
    if (!isEditing) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(
      findPostById({
        id,
        signal
      })
    );
    dispatch(addSnackbar('Please wait while data is loading...'));

    return () => {
      controller.abort();
    };
  }, [params]);

  return (
    <>
      <h1 className="text-center fw-bold mb-4">Write new post</h1>
      <BlogForm
        isEditing={isEditing}
        defaultValues={isEditing ? (post as BlogDataType) : defaultValues}
      />
    </>
  );
};

export default AddEditBlogPage;
