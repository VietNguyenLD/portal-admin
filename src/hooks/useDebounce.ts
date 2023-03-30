import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [searchTerm, setSearchTerm] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return searchTerm;
}

export default useDebounce;
