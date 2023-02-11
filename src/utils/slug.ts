import slugify from 'slugify';

export const slug = (string: string) => {
  return slugify(string, {
    lower: true,
    locale: 'en',
    trim: true
  });
};
