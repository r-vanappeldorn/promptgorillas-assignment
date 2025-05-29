'use client'
import { useRef, useState } from 'react';

export default function Home() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const uploadChunk = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'chunk.webm');

      if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL === undefined) {
        throw new Error('NEXT_PUBLIC_N8N_WEBHOOK_URL is not set');
      }

      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Fout bij uploaden:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          uploadChunk(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData();
        }
      }, 3000); // elke 3 seconden
    } catch (err) {
      console.error('Microfoon toegang geweigerd of niet beschikbaar:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRecording(false);
  };

  return (
    <div>
      <main className="h-dvh w-[100%] flex justify-center items-center flex-col">
        <div className="flex items-center">
          <h1>Start recording</h1>
          <button className="w-[30px] h-[30px] p-[5px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 rounded-full cursor-pointer ml-2"
            onClick={isRecording ? stopRecording : startRecording}
          >
            <svg fill="#fff" height="20px" width="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <g>
                <g>
                  <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
                  <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
                </g>
              </g>
            </svg>
          </button>
        </div>
        {isRecording ? 'Stop opname' : 'Start opname'}
      </main>
    </div>
  );
}
