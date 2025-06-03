import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export function saveWebmHeaderChunk(buffer: Buffer, sessionId: string): string {
  // Look for the Cluster tag: 0x1F 43 B6 75
  const signature = Buffer.from([0x1f, 0x43, 0xb6, 0x75]);
  const idx = buffer.indexOf(signature);

  if (idx === -1) {
    throw new Error('Could not find Cluster start in buffer — invalid WebM chunk?');
  }

  const headerOnly = buffer.subarray(0, idx);
  const headerPath = path.join(tmpdir(), `webm-header-${sessionId}.webm`);
  fs.writeFileSync(headerPath, headerOnly);

  return headerPath;
}

export function patchChunkWithHeader(rawChunkBuffer: Buffer, sessionId: string): string {
  const headerPath = path.join(tmpdir(), `webm-header-${sessionId}.webm`);
  if (!fs.existsSync(headerPath)) {
    throw new Error(`Missing header for session: ${sessionId}`);
  }

  const header = fs.readFileSync(headerPath);
  const combined = Buffer.concat([header, rawChunkBuffer]);

  const patchedPath = path.join(tmpdir(), `patched-${Date.now()}-${sessionId}.webm`);
  fs.writeFileSync(patchedPath, combined);

  return patchedPath;
}
