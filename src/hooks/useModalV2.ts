import { useState } from 'react';

const useModalV2 = () => {
  const [modalOpen, toggleModalOpen] = useState(false);

  function setModalOpen(flag: boolean) {
    toggleModalOpen(flag);
  }

  return {
    modalOpen,
    setModalOpen,
  };
};

export default useModalV2;
