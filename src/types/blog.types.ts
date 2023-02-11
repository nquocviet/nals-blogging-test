export type BlogType = {
  id: number;
  title: string;
  description?: string;
  slug: string;
  content: Record<string, any>;
  thumbnail: string; //base64
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogDataType = Pick<
  BlogType,
  'title' | 'description' | 'thumbnail' | 'content' | 'published'
>;
