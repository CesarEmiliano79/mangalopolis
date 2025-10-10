import { readFile } from 'fs/promises';
import path from 'path';

let blocklist;
let emailsValidos;

export async function isDisposable(email) {
  if (!blocklist) {

    const filePath = path.join(process.cwd(), 'disposable_email_blocklist.conf');
    const content = await readFile(filePath, { encoding: 'utf-8' });
    blocklist = content.split(/\r?\n/).filter(Boolean);
  }
  const domain = email.split('@')[1].toLowerCase();
  return blocklist.includes(email.split('@')[1]);
}

export async function valido(email){
  if (!emailsValidos) {

    const filePath = path.join(process.cwd(), 'emails_validos.conf');
    const content = await readFile(filePath, { encoding: 'utf-8' });
    emailsValidos = content.split(/\r?\n/).filter(Boolean);
  }
  const domain = email.split('@')[1].toLowerCase();
  return emailsValidos.includes(email.split('@')[1]);
}

