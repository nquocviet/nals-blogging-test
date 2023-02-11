import React, { ReactElement } from 'react';
import { useFormContext, FieldValues, UseFormReturn } from 'react-hook-form';

type TConnectFormProps = FieldValues & {
  children(children: UseFormReturn): ReactElement;
};

const ConnectForm: React.FunctionComponent<TConnectFormProps> = ({
  children
}) => {
  const methods = useFormContext();

  return children({ ...methods });
};

export default ConnectForm;
