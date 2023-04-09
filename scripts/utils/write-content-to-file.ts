import fs from 'fs/promises';
import path from 'path';

async function writeContentToFile(filePath: string, content: string) {
  await ensureDirExists(filePath);
  await fs.writeFile(filePath, content);
}

async function ensureDirExists(filePath: string) {
  return fs.mkdir(path.dirname(filePath), { recursive: true });
}

export default writeContentToFile;
