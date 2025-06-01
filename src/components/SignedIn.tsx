'use client';

import DocumentList from './documentList';
import { Recorder } from './recorder';
import Alert from './alert';
import ContextProvider from '@/contexts/contextProvider';

type Props = {
  access_token: string;
};

export default function SignedIn({ access_token }: Props) {
  return (
    <ContextProvider>
      <main className="h-dvh w-[100%] flex justify-center items-center flex-col">
        <DocumentList access_token={access_token} />
        <Recorder access_token={access_token} />
        <Alert />
      </main>
    </ContextProvider>
  );
}
