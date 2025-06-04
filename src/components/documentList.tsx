'use client';

import { getEnv } from '@/utils/env';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingLIcon from './svgs/loadingIcon';
import { useDocumentContext } from '@/contexts/documentsContext';
import { useAlert } from '@/contexts/alerContext';

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
  const { setShow, setMessage } = useAlert();

  const handleCreateNewDocument = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    const documentName = (event.target as HTMLInputElement).value.trim();
    const body = {
      name: documentName,
      mimeType: 'application/vnd.google-apps.document',
    };

    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data?.id) {
        setDocs(prev => [{ id: data.id, name: documentName }, ...prev]);
        setShow(true);
        setMessage('New document created');
        (event.target as HTMLInputElement).value = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

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
              <div
                className={`flex items-center justify-between px-4 py-3 hover:bg-indigo-100 cursor-pointer transition-colors`}>
                <input
                  onKeyDown={event => handleCreateNewDocument(event)}
                  id="create-doc"
                  placeholder="create new document"
                  className=" outline-none border border-gray-300 rounded px-4 py-2 w-full"
                />
              </div>
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
