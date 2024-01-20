import { useState, useEffect } from "react";
import { getLocalStorage } from "../helpers/get-local-storage";

export const useLocalStorage = <T>(key: string):[T,React.Dispatch<React.SetStateAction<T>> ] => {
  const [value, setValue] = useState<T>(getLocalStorage(key));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};