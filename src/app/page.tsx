'use client'
import { useRef, useState } from 'react'
import { Mic } from '@/components/svgs/mic'

export default function Home() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const uploadChunk = async (blob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'chunk.webm')

      if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL === undefined) {
        throw new Error('NEXT_PUBLIC_N8N_WEBHOOK_URL is not set')
      }

      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      console.error('Fout bij uploaden:', error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          uploadChunk(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      intervalRef.current = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData()
        }
      }, 3000) // elke 3 seconden
    } catch (err) {
      console.error('Microfoon toegang geweigerd of niet beschikbaar:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsRecording(false)
  }

  return (
    <div>
      <main className="h-dvh w-[100%] flex justify-center items-center flex-col">
        <div className="flex items-center">
          <h1>Start recording</h1>
          <button
            className="w-[30px] h-[30px] p-[5px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 rounded-full cursor-pointer ml-2"
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic/>
          </button>
        </div>
        {isRecording ? 'Stop opname' : 'Start opname'}
      </main>
    </div>
  )
}
