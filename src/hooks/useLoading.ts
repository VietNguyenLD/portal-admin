import { useState } from 'react';

function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);

  function toggleLoading(flag: boolean) {
    setLoading(flag);
  }

  return {
    loading,
    toggleLoading,
  };
}

export default useLoading;
