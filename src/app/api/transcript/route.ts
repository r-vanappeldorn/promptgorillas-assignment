import { patchChunkWithHeader, saveWebmHeaderChunk } from '@/utils/chunks';
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs, { createReadStream } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('audio') as File;
  const sessionId = formData.get('document_id') as string;

  const blobBuffer = Buffer.from(await file.arrayBuffer());

  if (formData.get('is_first_chunk') === 'true') {
    saveWebmHeaderChunk(blobBuffer, sessionId);

    const headerFilePath = path.join(tmpdir(), `patched-${Date.now()}-${sessionId}.webm`);
    fs.writeFileSync(headerFilePath, blobBuffer);

    const stream = createReadStream(headerFilePath);
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'audio/webm',
        'Content-Disposition': 'inline; filename="fixed.webm"',
      },
    });
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
