import React, {
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for a single key
type KeyType = {
  key_id: number;
  key_name: string;
  key_value?: string;
  key_signature?: string;
  key_type: number;
  key_loaded: boolean;
};

// Define the type for the entire Keys object (hash table)
type Keys = KeyType[];

// Define the type for the context state and dispatcher
type KeysContextState = {
  keys: Keys;
  setKeys: Dispatch<SetStateAction<Keys>>;
};

// Create the context
const KeysContext = createContext<KeysContextState | undefined>(undefined);

// Create a custom hook to access the context
const useKeysContext = () => {
  const context = useContext(KeysContext);
  if (!context) {
    throw new Error("useKeysContext must be used within a KeysContextProvider");
  }
  return context;
};

// Create the context provider component
const KeysContextProvider: React.FC<KeysContextProps> = ({
  keys: initialKeys,
  children,
}) => {
  const [keys, setKeys] = React.useState<Keys>(initialKeys);

  return (
    <KeysContext.Provider value={{ keys, setKeys }}>
      {children}
    </KeysContext.Provider>
  );
};

interface KeysContextProps {
  keys: Keys;
  children: ReactNode;
}

export { KeysContext, useKeysContext, KeysContextProvider };
export type { KeyType };
