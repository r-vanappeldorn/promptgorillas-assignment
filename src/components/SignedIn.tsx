'use client';

import DocumentList from '@/components/documentList';
import Alert from '@/components/alert';
import ContextProvider from '@/contexts/contextProvider';
import { Recorder } from './recorder';

type Props = {
  access_token: string;
};

export default function SignedIn({ access_token }: Props) {
  return (
    <ContextProvider>
      <main className="h-dvh w-[100%] px-40 pt-30">
        <h1 className="text-4xl font-medium text-gray-700 mb-4">
          Select a document
        </h1>
        <div className="flex justify-between flex-row">
          <DocumentList access_token={access_token} />
          <Recorder access_token={access_token} />
          <Alert />
        </div>
      </main>
    </ContextProvider>
  );
}
