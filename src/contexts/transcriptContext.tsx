'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type TranscriptContext = {
  transcript: string;
  setTranscript: Dispatch<string>;
};

const TranscriptContext = createContext<TranscriptContext | undefined>(undefined);

function TranscriptProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscript] = useState('');

  return (
    <TranscriptContext.Provider
      value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
}

function useTranscript() {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export {
  useTranscript, 
  TranscriptProvider
};