'use client';

import { useRef, useState } from 'react';
import { Mic } from '@/components/svgs/mic';
import { LanguageSelector } from '@/components/languageSelector';
import { useAlert } from '@/contexts/alerContext';
import { useDocumentContext } from '@/contexts/documentsContext';

const defaultIsoCode = 'nl';

type Props = {
  access_token: string;
};

export function Recorder({ access_token }: Props) {
  const [selectedIsoCode, setSelectedIsoCode] = useState(defaultIsoCode);
  const [isRecording, setIsRecording] = useState(false);
  let count = useRef(0);

  const { setShow, setTitle, setMessage } = useAlert();
  const { documentId } = useDocumentContext();

  const triggerAlert = () => {
    setTitle('No document selected');
    setMessage(
      'A document must be selected before you can start recording a transcript',
    );
    setShow(true);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      if (typeof webhookUrl === 'undefined' || webhookUrl === '') {
        throw Error('NEXT_PUBLIC_N8N_WEBHOOK_URL is undefinec');
      }

      const res = await fetch('/api/transcript', {
        method: 'POST',
        body: formData,
      });

      if (
        count.current > 0 &&
        res.ok &&
        res.headers.get('Content-Type')?.startsWith('audio/')
      ) {
        const url = URL.createObjectURL(await res.blob());
        console.log(url); // ✅ this should now point to actual audio
      } else {
        const result = await res.json();
        console.log(result); // e.g. { status: 'header_saved' }
      }

      count.current++;
    } catch (err) {
      console.error('Unable to upload chunk:', err);
    }
  };

  const startRecording = async () => {
    if (documentId === null) {
      triggerAlert();

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          await uploadChunk(event.data);
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
      setIsRecording(true);
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      console.error('No access to microfoon:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach(track => track.stop());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    count.current = 0;
    setIsRecording(false);
  };

  return (
    <>
      <LanguageSelector
        defaultIsoCode={defaultIsoCode}
        setIsoCode={setSelectedIsoCode}
      />
      <div className="flex items-center transition">
        <h1>Start recording</h1>
        <button
          className="w-[30px] h-[30px] p-[5px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 rounded-full cursor-pointer ml-2"
          onClick={isRecording ? stopRecording : startRecording}>
          <Mic />
        </button>
      </div>
    </>
  );
}
