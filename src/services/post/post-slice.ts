import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '@/lib/axios';
import { BlogType } from '@/types/blog.types';
import { lazyPromise } from '@/utils/lazy-promise';
import { slug } from '@/utils/slug';
import { snackbarSlice } from '../snackbar';
import { RootState } from '../reducers';

type TParams = {
  title_like: string;
  _page: number;
  _limit: number;
  _sort: 'createdAt';
  _order: 'desc' | 'asc';
};

type TInitialState = {
  posts: BlogType[];
  post: BlogType | null;
  params: TParams;
  loading: boolean;
  count: number;
};

const defaultParams: TParams = {
  title_like: '',
  _page: 1,
  _limit: 5,
  _sort: 'createdAt',
  _order: 'desc'
};

export type TParamsKeys = keyof typeof defaultParams;
export type TParamsValueTypes = TParams[TParamsKeys];

const initialState: TInitialState = {
  posts: [],
  post: null,
  params: defaultParams,
  loading: false,
  count: 0
};

export const findPosts = createAsyncThunk(
  'posts/findPosts',
  async (signal: any, { getState, rejectWithValue }) => {
    try {
      const { post } = getState() as RootState;
      const response = await lazyPromise(
        instance.get('/posts', {
          params: post.params,
          ...(signal && { signal })
        })
      );

      return {
        data: response.data,
        count: Number(response.headers['x-total-count'])
      };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const findPostById = createAsyncThunk(
  'posts/findPostById',
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const { id, ...rest } = params;
      const response = await lazyPromise(instance.get(`/posts/${id}`, rest));

      return {
        data: response.data
      };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (body: Record<string, any>, { dispatch, rejectWithValue }) => {
    try {
      const data = {
        ...body,
        slug: slug(body.title),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await lazyPromise(instance.post('/posts', data));

      dispatch(snackbarSlice.actions.addSnackbar('Created post successfully'));

      return {
        data: response.data
      };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (body: Record<string, any>, { dispatch, rejectWithValue }) => {
    try {
      const { id, ...rest } = body;
      const data = {
        ...rest,
        updatedAt: new Date()
      };

      const response = await lazyPromise(instance.patch(`/posts/${id}`, data));

      dispatch(snackbarSlice.actions.addSnackbar('Updated post successfully'));

      return {
        data: response.data
      };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (body: Record<string, any>, { dispatch }) => {
    try {
      const { id, title } = body;
      await instance.delete(`/posts/${id}`);

      dispatch(
        snackbarSlice.actions.addSnackbar(`Deleted post ${title} successfully`)
      );
      dispatch(findPosts(null));

      return {
        message: `Deleted post ${title} successfully`
      };
    } catch (error: any) {
      return error;
    }
  }
);

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;

      state.params = {
        ...state.params,
        [key]: value
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(findPosts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(findPosts.fulfilled, (state, action) => {
      const { data, count } = action.payload;

      state.posts = data;
      state.count = count;
      state.loading = false;
    });

    builder.addCase(findPosts.rejected, (state, action) => {
      if ((action.payload as any)?.code !== 'ERR_CANCELED') {
        state.loading = false;
      }
    });

    builder.addCase(findPostById.pending, (state) => {
      state.loading = true;
      state.post = null;
    });

    builder.addCase(findPostById.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.loading = false;
      state.post = data;
    });

    builder.addCase(findPostById.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createPost.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.loading = false;
      state.posts = [data, ...state.posts];
    });

    builder.addCase(createPost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updatePost.fulfilled, (state, action) => {
      const { data } = action.payload;

      const newPosts = state.posts.map((post) => {
        if (post.id === data.id) {
          return data;
        }
        return post;
      });

      state.loading = false;
      state.posts = newPosts;
      state.post = data;
    });

    builder.addCase(updatePost.rejected, (state) => {
      state.loading = false;
    });
  }
});

export const { setFilter } = postSlice.actions;

export const selectorPostState = (state: { post: TInitialState }) => state.post;
export const selectorPosts = (state: { post: TInitialState }) =>
  state.post.posts;
export const selectorPost = (state: { post: TInitialState }) => state.post.post;

export default postSlice.reducer;
