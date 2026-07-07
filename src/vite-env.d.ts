/// <reference types="vite/client" />

declare module "swiper/react";

declare module "swiper/modules";

declare module "react-hook-form" {
  interface FieldError {
    message?: string;
    type?: string;
  }

  type FieldErrors<T> = {
    [K in keyof T]?: FieldError;
  };

  interface RegisterOptions {
    required?: string;
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    setValueAs?: (value: string) => string;
    validate?: (value: string) => boolean | string;
  }

  interface UseFormReturn<T> {
    handleSubmit: (onSubmit: (data: T) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: (name: keyof T, options?: RegisterOptions) => Record<string, unknown>;
    formState: { errors: FieldErrors<T> };
    reset: () => void;
    getValues: (field?: keyof T) => string;
  }

  export function useForm<T>(): UseFormReturn<T>;
}
