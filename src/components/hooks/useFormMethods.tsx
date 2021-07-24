import { FormMethodsRef } from "components/form/types";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface UseFormMethodsReturn {
  methods?: UseFormReturn;
  watchValue: (name: string, defaultValue: any) => any;
  ref: MutableRefObject<FormMethodsRef | null>;
}

export function useFormMethods(): UseFormMethodsReturn {
  const ref = useRef<FormMethodsRef>(null);
  const [methods, setMethods] = useState<UseFormReturn>();

  const watchValue = (name: string, defaultValue?: any) => {
    const handleValueChange = (_value: any) => {
      setValue(_value);
    };

    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      if (ref.current) {
        ref.current.changeHandlers.addListener(name, handleValueChange);
      }

      return () => {
        if (ref.current) {
          ref.current.changeHandlers.removeListener(name, handleValueChange);
        }
      };
    }, [ref.current]);

    return value;
  };

  useEffect(() => {
    if (ref.current) {
      setMethods(ref.current?.methods);
    }
  }, [ref.current]);

  return {
    methods,
    watchValue,
    ref,
  };
}