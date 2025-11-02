'use client';

import { useFormContext, FieldValues, Path } from 'react-hook-form';
import { Radio, RadioProps, RadioOption } from '@/app/components/ui/forms';

interface FormRadioProps<TFieldValues extends FieldValues>
  extends Omit<RadioProps, 'name' | 'value' | 'onChange' | 'error'> {
  name: Path<TFieldValues>;
  required?: boolean;
}

export default function FormRadio<TFieldValues extends FieldValues>({
  name,
  required,
  options,
  ...props
}: FormRadioProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>();

  if (!form) {
    throw new Error('FormRadio must be used within a FormProvider');
  }

  const {
    formState: { errors },
    setValue,
    watch,
  } = form;

  const error = errors[name];
  const currentValue = watch(name);

  const handleChange = (value: string) => {
    setValue(name, value as any, { shouldValidate: true });
  };

  return (
    <Radio
      name={name}
      options={options}
      required={required}
      value={currentValue as string}
      onChange={handleChange}
      error={error?.message as string}
      {...props}
    />
  );
}
