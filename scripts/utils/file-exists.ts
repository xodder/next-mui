import fs from 'fs/promises';

async function fileExists(filePath: string) {
  return fs.open(filePath).then(
    () => true,
    () => false
  );
}

export default fileExists;
