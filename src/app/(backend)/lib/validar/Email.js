import { readFile } from 'fs/promises';
import path from 'path';

let blocklist;

export default async function isDisposable(email) {
  if (!blocklist) {

    const filePath = path.join(process.cwd(), 'disposable_email_blocklist.conf');
    const content = await readFile(filePath, { encoding: 'utf-8' });
    blocklist = content.split(/\r?\n/).filter(Boolean);
  }
  const domain = email.split('@')[1].toLowerCase();
  return blocklist.includes(email.split('@')[1]);
}

