import React, { useEffect, useMemo } from 'react';

import { cn } from '@/lib/utils';

interface Props extends Omit<React.ComponentProps<'input'>, 'size'> {
  label: string;
  size?: 'sm' | 'default' | 'lg';
}

function FloatingInput({
  label,
  value: state,
  onChange,
  className = '',
  size = 'default',
  defaultValue,
  required,
  ...props
}: Props) {
  const [value, setValue] = React.useState<
    React.ComponentProps<'input'>['value']
  >(defaultValue || state || '');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onChange?.(e);
  }

  const hasValue = useMemo(() => {
    if (!value) return false;
    if (typeof value == 'number') {
      return true;
    }
    return value.length > 0;
  }, [value]);

  useEffect(() => {
    setValue(state);
  }, [state]);

  return (
    <div
      data-size={size}
      className={cn(
        'relative h-fit w-full data-[size=default]:h-9 data-[size=lg]:h-10',
        className,
      )}
    >
      <input
        required={required}
        className={cn(
          'peer flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 pt-4 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        )}
        value={value}
        onChange={handleChange}
        {...props}
      />
      <label
        className={cn(
          'pointer-events-none absolute left-0 pl-3 text-muted-foreground transition-all',
          {
            'top-1 !text-xs': hasValue,
            'top-1/2 -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:text-xs':
              !hasValue,
          },
        )}
      >
        {label} {required ? <span className="text-destructive">*</span> : null}
      </label>
    </div>
  );
}

export { FloatingInput };
