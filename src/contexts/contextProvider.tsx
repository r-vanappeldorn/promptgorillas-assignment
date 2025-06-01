'use client';

import { AlertProvider } from "./alerContext";
import { DocumentProvider } from "./documentsContext";

type Props = {
  children: React.ReactNode;
}

export default function ContextProvider({children}: Props) {
  return (
    <DocumentProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </DocumentProvider>
  )
}