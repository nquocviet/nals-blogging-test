import React, { ChangeEvent } from 'react';
import { BsSortDown, BsSearch } from 'react-icons/bs';
import { Dropdown } from 'react-bootstrap';
import { Form, FormControl } from '@/components';
import styles from './SearchFilter.module.css';
import { TParamsKeys, TParamsValueTypes } from '@/services/post';

type TSearchFilterProps = {
  setSearch: (value: string) => void;
  onChangeParams: (key: TParamsKeys, value: TParamsValueTypes) => void;
};

const SearchFilter: React.FunctionComponent<TSearchFilterProps> = ({
  setSearch,
  onChangeParams
}) => {
  return (
    <>
      <h1 className={styles['title']}>Recent posts</h1>
      <Form className={styles['form']}>
        <FormControl
          placeholder="Search whatever you need..."
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearch(event.target.value)
          }
          leading={<BsSearch />}
          trailing={
            <div className={styles['button-dropdown']}>
              <Dropdown align="end">
                <Dropdown.Toggle aria-label="Sort options">
                  <BsSortDown size={16} />
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles['button-dropdown-menu']}>
                  <Dropdown.Item
                    onClick={() => onChangeParams('_order', 'desc')}>
                    Latest post
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onChangeParams('_order', 'asc')}>
                    Oldest post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          }
        />
      </Form>
    </>
  );
};

export default SearchFilter;
