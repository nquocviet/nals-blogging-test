import clsx from 'clsx';
import React, { forwardRef, ReactNode } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import styles from './FormControl.module.css';

type TFormControlBaseProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
};
type TFormControlProps = TFormControlBaseProps &
  React.ComponentProps<typeof Form.Control>;

const FormControl = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TFormControlProps
>(
  (
    { value, onChange, onBlur, leading, trailing, placeholder, ...rest },
    ref
  ) => {
    if (leading || trailing) {
      return (
        <InputGroup className="mb-3">
          {leading && (
            <InputGroup.Text className={styles['input-group-leading']}>
              {leading}
            </InputGroup.Text>
          )}
          <Form.Control
            value={value}
            ref={ref}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            className={styles['form-control']}
            {...rest}
          />
          {trailing && (
            <InputGroup.Text className={styles['input-group-trailing']}>
              {trailing}
            </InputGroup.Text>
          )}
        </InputGroup>
      );
    }

    return (
      <Form.Control
        value={value}
        ref={ref}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx('mb-3', styles['form-control'])}
        {...rest}
      />
    );
  }
);

FormControl.displayName = 'FormControl';

export default FormControl;
