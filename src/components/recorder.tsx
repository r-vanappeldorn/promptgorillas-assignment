'use client';

import { useRef, useState, useEffect } from 'react';
import { Mic } from '@/components/svgs/mic';
import LanguageSelector from '@/components/languageSelector';
import { useAlert } from '@/contexts/alerContext';
import { useDocumentContext } from '@/contexts/documentsContext';

const defaultIsoCode = 'nl';

type Props = {
  access_token: string;
};

export function Recorder({ access_token }: Props) {
  const [selectedIsoCode, setSelectedIsoCode] = useState(defaultIsoCode);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  let count = useRef(0);

  const { setShow, setTitle, setMessage } = useAlert();
  const { documentId } = useDocumentContext();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAlert = () => {
    setTitle('No document selected');
    setMessage(
      'A document must be selected before you can start recording a transcript',
    );
    setShow(true);
  };

  const uploadChunk = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append(
        'audio',
        new File([blob], 'chunk.webm', { type: 'audio/webm' }),
      );
      formData.append('document_id', documentId!);
      formData.append('iso_code', selectedIsoCode);
      formData.append('access_token', access_token);
      formData.append('is_first_chunk', count.current === 0 ? 'true' : 'false');

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (!webhookUrl) throw Error('NEXT_PUBLIC_N8N_WEBHOOK_URL is undefined');

      const res = await fetch('/api/transcript', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('Content-Type') || '';
      if (!res.ok || !contentType.startsWith('audio/')) {
        console.warn(
          'Invalid response from /api/transcript:',
          await res.text(),
        );
        return;
      }

      const patchedBlob = await res.blob();

      const n8nForm = new FormData();
      n8nForm.append(
        'audio',
        new File([patchedBlob], 'chunk.webm', { type: 'audio/webm' }),
      );
      n8nForm.append('document_id', documentId!);
      n8nForm.append('iso_code', selectedIsoCode);
      n8nForm.append('access_token', access_token);

      const n8nRes = await fetch(webhookUrl, {
        method: 'POST',
        body: n8nForm,
      });

      console.log(await n8nRes.json());
      count.current++;
    } catch (err) {
      console.error('Unable to upload chunk:', err);
    }
  };

  const startRecording = async () => {
    if (!documentId) {
      triggerAlert();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      let chunkQueue: Blob[] = [];
      let uploading = false;

      const flushQueue = async () => {
        if (uploading || chunkQueue.length === 0) return;
        uploading = true;
        while (chunkQueue.length > 0) {
          const blob = chunkQueue.shift();
          if (blob) await uploadChunk(blob);
        }
        uploading = false;
      };

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunkQueue.push(event.data);
          flushQueue();
        } else {
          console.log('chunk skipped');
        }
      };

      mediaRecorder.start();

      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.requestData();
          }
        }, 3000);
      }, 3000);

      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      setIsRecording(true);
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      console.error('No access to microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach(track => track.stop());

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    count.current = 0;
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div>
      <LanguageSelector
        selectedIsoCode={selectedIsoCode}
        setIsoCode={setSelectedIsoCode}
      />
      <div className="flex flex-col items-center space-y-2 mt-4">
        <div className="text-5xl text-gray-800">{formatTime(elapsedTime)}</div>
        <button
          className={`w-25 h-25 p-[5px] transition-all ease-in-out duration-300 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 focus:outline-none rounded-full cursor-pointer outline-none ${isRecording ? 'bg-indigo-600 hover:bg-indigo-600 animation-pulse' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}>
          <Mic height={isRecording ? 30 : 50} width={isRecording ? 30 : 50} />
        </button>
      </div>
    </div>
  );
}
