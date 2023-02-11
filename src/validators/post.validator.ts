import { object, string } from 'yup';
import { MAX_LENGTH_255, MAX_LENGTH_1024 } from '@/utils/constants';

export const schema = object({
  title: string()
    .max(
      MAX_LENGTH_255,
      `Title must be shorter than or equal to ${MAX_LENGTH_255} characters`
    )
    .required('Title should not be empty'),
  description: string()
    .max(
      MAX_LENGTH_1024,
      `Description must be shorter than or equal to ${MAX_LENGTH_1024} characters`
    )
    .required('Description should not be empty'),
  thumbnail: string().required('Thumbnail should not be empty'),
  content: object().required('Content should not be empty')
});
