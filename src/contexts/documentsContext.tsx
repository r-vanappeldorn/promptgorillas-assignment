import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type DocumentsContextProps = {
  documentId: string | null;
  setDocumentId: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const DocumentContext = createContext<DocumentsContextProps | undefined>(
  undefined,
);

function DocumentProvider({ children }: { children: ReactNode }) {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <DocumentContext.Provider
      value={{
        documentId,
        setDocumentId,
        loading,
        setLoading,
      }}>
      {children}
    </DocumentContext.Provider>
  );
}

function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error(
      'useDocumentContext must be used within an DocumentConext provider',
    );
  }
  return context;
}

export { DocumentProvider, useDocumentContext };
