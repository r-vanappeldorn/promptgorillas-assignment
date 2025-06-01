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
      const docsUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=20`;

      console.log(access_token);

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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Selecteer een document</h1>
      <div
        className={`transition-opacity duration-700 ${
          startTransition
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none h-0 overflow-hidden'
        }`}>
        <div className="flex items-center space-x-2">
          <LoadingLIcon />
          <span>Loading...</span>
        </div>
      </div>

      <div
        className={`transition-opacity duration-700 ${
          loading
            ? 'opacity-0 pointer-events-none h-0 overflow-hidden'
            : 'opacity-100'
        }`}>
        {docs.length > 0 ? (
          <ul className="space-y-4">
            {docs.map(doc => (
              <li
                key={doc.id}
                className="border p-2 rounded shadow flex justify-between items-center">
                <Link
                  href={`https://docs.google.com/document/d/${doc.id}`}
                  target="_blank"
                  className="text-blue-600 hover:underline">
                  {doc.name}
                </Link>
                <input
                  id="default-checkbox"
                  checked={documentId === doc.id}
                  type="checkbox"
                  onChange={() =>
                    setDocumentId(documentId === doc.id ? null : doc.id)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Google Docs found.</p>
        )}
      </div>
    </main>
  );
}
