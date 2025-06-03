import { patchChunkWithHeader, saveWebmHeaderChunk } from '@/utils/chunks';
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream } from 'fs';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('audio') as File;
  const sessionId = formData.get('document_id') as string;

  const blobBuffer = Buffer.from(await file.arrayBuffer());

  console.log(formData.get('is_first_chunk') === 'true');
  if (formData.get('is_first_chunk') === 'true') {
    saveWebmHeaderChunk(blobBuffer, sessionId);

    return NextResponse.json({ status: 'header_saved' });
  }

  const patchedPath = patchChunkWithHeader(blobBuffer, sessionId);

  const outputPath = `/tmp/fixed-${Date.now()}.webm`;
  await execAsync(
    `ffmpeg -y -i "${patchedPath}" -c:a libopus -b:a 64k "${outputPath}"`,
  );

  const stream = createReadStream(outputPath);
  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      'Content-Type': 'audio/webm',
      'Content-Disposition': 'inline; filename="fixed.webm"',
    },
  });
}
