export const ROUTES = {
  HOME: '/',
  BLOG: {
    NEW: '/blog/new',
    DETAILS: '/blog/:id/:slug',
    EDIT: '/blog/:id/:slug/edit'
  }
} as const;
