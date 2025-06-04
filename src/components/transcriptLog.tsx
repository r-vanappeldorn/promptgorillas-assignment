'use client';

import { useDocumentContext } from '@/contexts/documentsContext';
import { useTranscriptContext } from '@/contexts/transcriptContext';
import { useEffect } from 'react';

export default function TranscriptLog() {
  const { transcript, setTranscript } = useTranscriptContext();
  const { documentId } = useDocumentContext();

  useEffect(() => {
    setTranscript('');
  }, [documentId]);

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Output
      </label>
      <div className="mb-4 p-4 min-h-40 bg-white border border-gray-200 rounded-lg shadow-md max-h-80 overflow-y-auto text-sm text-gray-800 whitespace-pre-wrap font-mono">
        {transcript !== '' ? (
          transcript
        ) : (
          <span className="text-gray-400">Transcript will appear here...</span>
        )}
      </div>
    </>
  );
}
