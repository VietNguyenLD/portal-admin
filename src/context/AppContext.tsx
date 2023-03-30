import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

interface AppContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextProps>({
  loading: false,
  setLoading() {},
});

function AppProvider(props: AppProviderProps) {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
