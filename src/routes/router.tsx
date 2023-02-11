import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './constants';
import { BaseLayout } from '@/layouts';
import { AddEditBlog, BlogDetails, Home } from '@/pages';

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />
      },
      {
        path: ROUTES.BLOG.NEW,
        element: <AddEditBlog />
      },
      {
        path: ROUTES.BLOG.DETAILS,
        element: <BlogDetails />
      },
      {
        path: ROUTES.BLOG.EDIT,
        element: <AddEditBlog />
      }
    ]
  }
]);
