'use client';

import { getEnv } from '@/utils/env';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingLIcon from './svgs/loadingIcon';
import { useDocumentContext } from '@/contexts/documentsContext';

type Props = {
  access_token: string;
};

type GoogleDoc = {
  id: string;
  name: string;
};

export default function DocumentList({ access_token }: Props) {
  const [docs, setDocs] = useState<GoogleDoc[]>([]);
  const [startTransition, setStartTransition] = useState<boolean>(true);
  const { setDocumentId, documentId, loading, setLoading } =
    useDocumentContext();
  const { baseUrl } = getEnv();

  useEffect(() => {
    async function getGoogleDocs() {
      const q = encodeURIComponent(
        "mimeType='application/vnd.google-apps.document'",
      );
      const docsUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`;

      const res = await fetch(docsUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = await res.json();
      if (data?.error?.code === 401) {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });

        window.location.href = baseUrl;
      }

      setDocs(data.files || []);

      setStartTransition(false);
      setTimeout(() => setLoading(false), 200);
    }

    getGoogleDocs();
  }, [access_token]);

  return (
    <section>
      <div
        className={`transition-all min-h-[422px] max-h-[422px] min-w-[500px] w-full duration-500 ease-in-out transform`}>
        <div
          className={`flex items-center justify-center space-x-4 text-gray-400 duration-500 ease-in-out transition-all w-100 ${startTransition ? 'h-100' : 'opacity-0 h-0'}`}>
          <LoadingLIcon />
          <span>Loading...</span>
        </div>
        <div
          className={
            loading ? 'opacity-0 max-h-0 pointer-events-none' : 'opacity-100'
          }>
          {docs.length > 0 ? (
            <div className="border-[1px] border-gray-300 mx-auto w-full rounded divide-y divide-gray-200 shadow-xl">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() =>
                    setDocumentId(documentId === doc.id ? null : doc.id)
                  }
                  className={`flex items-center justify-between px-4 py-3 hover:bg-indigo-100 cursor-pointer transition-colors ${documentId === doc.id ? 'bg-indigo-500 hover:bg-indigo-500 text-white' : ''}`}>
                  <Link
                    href={`https://docs.google.com/document/d/${doc.id}`}
                    target="_blank"
                    className="hover:underline truncate max-w-[80%]">
                    {doc.name}
                  </Link>
                  <input
                    checked={documentId === doc.id}
                    type="checkbox"
                    onChange={() =>
                      setDocumentId(documentId === doc.id ? null : doc.id)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No Google Docs found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
