import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent
} from 'react';
import { Form as BootstrapForm } from 'react-bootstrap';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  UseFormSetValue
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ConnectForm,
  Form,
  FormControl,
  RichEditor,
  Toggle
} from '@/components';
import { useToggle, useYupValidationResolver, useWindowScroll } from '@/hooks';
import { BlogDataType } from '@/types/blog.types';
import { convertToBase64 } from '@/utils/convert-to-base64';
import { resizeImage } from '@/utils/resize-image';
import { schema } from '@/validators/post.validator';
import { clearErrors, selectorErrors } from '@/services/error';
import styles from './BlogForm.module.css';
import { trimDataObject } from '@/utils/trim-data-object';
import { createPost, selectorPostState, updatePost } from '@/services/post';
import { AppDispatch } from '@/services/store';
import { convertFromRaw, RawDraftContentState } from 'draft-js';
import { addSnackbar } from '@/services/snackbar';

type TBlogFormProps = {
  isEditing: boolean;
  defaultValues: BlogDataType;
};

const BlogForm: React.FunctionComponent<TBlogFormProps> = ({
  isEditing,
  defaultValues
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useToggle(false);
  const [_, scrollTo] = useWindowScroll();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(selectorPostState);
  const { errors } = useSelector(selectorErrors);
  const resolver = useYupValidationResolver(schema);
  const hasContent =
    defaultValues?.content && !!Object.keys(defaultValues?.content).length;

  useEffect(() => {
    if (Object.keys(errors).length) {
      dispatch(
        addSnackbar('There is some errors when saving, please try again!')
      );
      scrollTo({ x: 0, y: 0 });
    }
  }, [errors]);

  const computeContentValue = (content: Record<string, any>) => {
    if (!hasContent) return;

    return convertFromRaw(content as RawDraftContentState);
  };

  const memoizedContent = useMemo(
    () => computeContentValue(defaultValues?.content),
    [defaultValues]
  );

  const onChangeImage = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement>,
      cb: UseFormSetValue<FieldValues>
    ): Promise<void> => {
      if (!event.target.files || !event.target.files['length']) return;

      const imageBase64 = await convertToBase64(event.target.files[0]);
      const imageResize = await resizeImage(imageBase64, 240, 160);

      setPreviewImage(imageResize);
      cb('thumbnail', imageResize);
    },
    []
  );

  const onSubmit: SubmitHandler<BlogDataType> = useCallback(
    async (data) => {
      const trimmedData = trimDataObject(data);
      const handler = isEditing ? updatePost : createPost;

      await dispatch(handler(trimmedData));

      scrollTo({ x: 0, y: 0 });
      dispatch(clearErrors());
      setPreviewImage(null);

      if (!isEditing) {
        setShouldReset(true);
        setTimeout(() => setShouldReset(false), 0);
      }
    },
    [isEditing]
  );

  return (
    <>
      {!!Object.values(errors).length && (
        <ul className={styles['error-fields']}>
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <Form
        defaultValues={defaultValues}
        resolver={resolver}
        onSubmit={onSubmit}
        shouldReset={shouldReset}>
        <ConnectForm>
          {({ control, setFocus, setValue }) => {
            useEffect(() => {
              setFocus('title');
            }, []);

            return (
              <>
                <BootstrapForm.Group>
                  <BootstrapForm.Label>Title</BootstrapForm.Label>
                  <Controller
                    control={control}
                    name="title"
                    defaultValue={defaultValues?.title || ''}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <FormControl
                        value={value}
                        ref={ref}
                        placeholder="New post title here..."
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group>
                  <BootstrapForm.Label>Description</BootstrapForm.Label>
                  <Controller
                    control={control}
                    name="description"
                    defaultValue={defaultValues?.title || ''}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <FormControl
                        as="textarea"
                        rows={4}
                        value={value}
                        ref={ref}
                        placeholder="Enter your post description here..."
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </BootstrapForm.Group>
                <div className="d-flex align-items-start mb-3">
                  {(previewImage || defaultValues?.thumbnail) && (
                    <img
                      src={previewImage || defaultValues?.thumbnail}
                      width={160}
                      className="me-3 rounded"
                    />
                  )}
                  <Button as="label">
                    Change thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(event) => onChangeImage(event, setValue)}
                    />
                  </Button>
                </div>
                <BootstrapForm.Group>
                  <BootstrapForm.Label>Content</BootstrapForm.Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <RichEditor
                        placeholder="Enter your post content here..."
                        minHeight={240}
                        shouldReset={shouldReset}
                        onChange={onChange}
                        {...(hasContent && {
                          defaultValue: memoizedContent
                        })}
                      />
                    )}
                  />
                </BootstrapForm.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <Controller
                    control={control}
                    name="published"
                    defaultValue={true}
                    render={({ field: { onChange, value, ref } }) => (
                      <Toggle
                        label="Public blog"
                        description="Enable to everyone"
                        checked={value}
                        ref={ref}
                        onChange={onChange}
                      />
                    )}
                  />
                  {loading ? (
                    <Button type="button">Saving...</Button>
                  ) : (
                    <Button type="submit">Save post</Button>
                  )}
                </div>
              </>
            );
          }}
        </ConnectForm>
      </Form>
    </>
  );
};

export default BlogForm;
