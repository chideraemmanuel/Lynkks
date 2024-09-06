'use client';

import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  useState,
} from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
// import EyeIcon from 'remixicon-react/EyeLineIcon';
// import EyeOffIcon from 'remixicon-react/EyeOffLineIcon';
import { RiEyeLine } from '@remixicon/react';
import { RiEyeCloseLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FormInputProps extends ComponentPropsWithoutRef<typeof Input> {
  label?: string;
  error?: string;
  addForgotPassword?: boolean;
  passwordResetInitiationHref?: string;
}

type FormInputRef = ElementRef<typeof Input>; //HTMLInputElement

const FormInput = React.forwardRef<FormInputRef, FormInputProps>(
  (
    {
      label,
      error,
      id,
      type,
      disabled,
      className,
      addForgotPassword,
      passwordResetInitiationHref,
      ...props
    },
    ref
  ) => {
    const [currentType, setCurrentType] = useState(type);

    return (
      <>
        <div className="w-full">
          <Label
            htmlFor={id}
            className="text-[#344054] font-medium text-sm leading-[140%] tracking-[-1.44%]"
          >
            {label}
          </Label>
          <div className="relative">
            <Input
              id={id}
              type={type === 'password' ? currentType : type}
              className={cn(
                `${error && 'border-destructive'}`,
                'bg-white shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] text-[#344054] text-base leading-[140%] tracking-[-0.4%] h-12 mt-1',
                className
              )}
              ref={ref}
              disabled={disabled}
              {...props}
            />

            {type === 'password' && (
              <Button
                type="button"
                variant={'secondary'}
                className={cn(
                  `h-fit w-fit p-0 bg-transparent hover:bg-transparent focus:bg-transparent absolute right-3 top-[50%] -translate-y-1/2`,
                  disabled && 'pointer-events-none'
                )}
                aria-description={`Toggle ${label}`}
                onClick={() =>
                  setCurrentType((previous) =>
                    previous === 'password' ? 'text' : 'password'
                  )
                }
              >
                {currentType === 'password' ? (
                  <RiEyeLine className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                ) : (
                  <RiEyeCloseLine className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                )}
              </Button>
            )}
          </div>

          {(addForgotPassword || error) && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-destructive">{error}</span>

              {type === 'password' &&
                addForgotPassword &&
                passwordResetInitiationHref && (
                  <Button
                    type="button"
                    variant={'link'}
                    asChild
                    className="flex justify-end h-fit px-0 py-0 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Link href={passwordResetInitiationHref}>
                      Forgot password?
                    </Link>
                  </Button>
                )}
            </div>
          )}
        </div>
      </>
    );
  }
);

export default FormInput;
