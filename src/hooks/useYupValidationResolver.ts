import { useCallback } from 'react';
import { ValidationError } from 'yup';

const useYupValidationResolver = (validationSchema: any) =>
  useCallback(
    async (data: Record<string, any>) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        if (errors instanceof ValidationError) {
          return {
            values: {},
            errors: errors.inner.reduce(
              (previous, current) => ({
                ...previous,
                [current.path as string]: current.message
              }),
              {}
            )
          };
        }
      }
    },
    [validationSchema]
  );

export default useYupValidationResolver;
