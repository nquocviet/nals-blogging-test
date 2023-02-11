import React, { forwardRef, ReactNode, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Form as BootstrapForm } from 'react-bootstrap';
import { setErrors } from '@/services/error';

type TFormProps = Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  defaultValues?: Record<string, any>;
  shouldReset?: boolean;
  resolver?: any;
  children: ReactNode;
  className?: string;
  onSubmit?: SubmitHandler<any>;
};

const Form = forwardRef<HTMLFormElement, TFormProps>(
  (
    { defaultValues, shouldReset, resolver, className, onSubmit, ...rest },
    ref
  ) => {
    const methods = useForm({ defaultValues, resolver });
    const dispatch = useDispatch();
    const {
      reset,
      handleSubmit,
      formState: { errors, isSubmitting }
    } = methods;

    useEffect(() => {
      reset(defaultValues);
    }, [defaultValues]);

    useEffect(() => {
      if (shouldReset) {
        reset(defaultValues);
      }
    }, [shouldReset, reset]);

    useEffect(() => {
      if (Object.keys(errors).length) {
        dispatch(setErrors(errors));
      }
    }, [errors]);

    const handleSubmitForm = (event: React.BaseSyntheticEvent) => {
      event.preventDefault();

      if (isSubmitting) return;

      handleSubmit(onSubmit as SubmitHandler<any>)();
    };

    return (
      <FormProvider {...methods}>
        <BootstrapForm
          className={className}
          onSubmit={onSubmit && handleSubmitForm}
          ref={ref}
          {...rest}
        />
      </FormProvider>
    );
  }
);

Form.displayName = 'Form';

export default Form;
