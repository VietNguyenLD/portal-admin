import { useState } from 'react';

function useReRender() {
  const [reRender, setReRender] = useState(false);

  function toggleReRender(flag: boolean) {
    setReRender(flag);
  }

  return {
    reRender,
    toggleReRender,
  };
}

export default useReRender;
