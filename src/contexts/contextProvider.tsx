'use client';

import { AlertProvider } from './alerContext';
import { DocumentProvider } from './documentsContext';
import { TranscriptProvider } from './transcriptContext';

type Props = {
  children: React.ReactNode;
};

export default function ContextProvider({ children }: Props) {
  return (
    <TranscriptProvider>
      <DocumentProvider>
        <AlertProvider>{children}</AlertProvider>
      </DocumentProvider>
    </TranscriptProvider>
  );
}
