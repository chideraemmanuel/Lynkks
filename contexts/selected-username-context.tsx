import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const selectedUsernameContext = createContext<{
  selectedUsername: string;
  setSelectedUsername: Dispatch<SetStateAction<string>>;
} | null>(null);

export const SelectedUsernameContextProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedUsername, setSelectedUsername] = useState('');

  return (
    <>
      <selectedUsernameContext.Provider
        value={{ selectedUsername, setSelectedUsername }}
      >
        {children}
      </selectedUsernameContext.Provider>
    </>
  );
};

const useSelectedUsernameContext = () => {
  const context = useContext(selectedUsernameContext);

  if (!context) {
    throw Error(
      '"useSelectedUsernameContext" must be used within "SelectedUsernameContextProvider"'
    );
  }

  return context;
};

export { useSelectedUsernameContext };

export default SelectedUsernameContextProvider;
