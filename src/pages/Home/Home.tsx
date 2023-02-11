import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '@/components';
import { BlogList } from '@/features/blog';
import { SearchFilter } from './components';
import {
  findPosts,
  selectorPostState,
  setFilter,
  TParamsKeys,
  TParamsValueTypes
} from '@/services/post';
import { AppDispatch } from '@/services/store';
import { useDebounce, useWindowScroll } from '@/hooks';

const DEFAULT_PAGE = 1;

const HomePage: React.FunctionComponent = () => {
  const { posts, loading, count, params } = useSelector(selectorPostState);
  const [_, scrollTo] = useWindowScroll();
  const [search, setSearch] = useDebounce(params.title_like);
  const dispatch = useDispatch<AppDispatch>();
  const pageCount = Math.ceil(count / params._limit);
  const hasNextPage = params._page < pageCount;
  const hasPreviousPage = params._page !== DEFAULT_PAGE;

  useEffect(() => {
    dispatch(
      setFilter({
        key: 'title_like',
        value: search?.trim()
      })
    );
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(findPosts(signal));

    return () => {
      controller.abort();
    };
  }, [params]);

  const onChangeParams = useCallback(
    (key: TParamsKeys, value: TParamsValueTypes) => {
      dispatch(
        setFilter({
          key,
          value
        })
      );
      scrollTo({ x: 0, y: 0 });
    },
    []
  );

  return (
    <>
      <SearchFilter setSearch={setSearch} onChangeParams={onChangeParams} />
      <BlogList posts={posts} loading={loading} />
      {!!count && (
        <Pagination
          currentPage={params._page}
          pageCount={pageCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onChange={(page) => onChangeParams('_page', page)}
        />
      )}
    </>
  );
};

export default HomePage;
