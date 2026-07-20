import { customAlphabet } from 'nanoid';
import { RESERVED_ALIASES } from '../constants/index.js';
import Link from '../models/Link.js';
import { env } from '../config/env.js';

// Unambiguous alphabet — no 0/O or 1/l/I confusion when a code is read aloud
// or typed by hand, which matters a lot for a link people re-type.
const ALPHABET = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

const nano = customAlphabet(ALPHABET, env.shortCodeLength);

export function isReserved(code) {
  return RESERVED_ALIASES.includes(String(code).toLowerCase());
}

export async function generateUniqueCode(maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const code = nano();
    // eslint-disable-next-line no-await-in-loop
    const exists = await Link.exists({ shortCode: code });
    if (!exists) return code;
  }
  throw new Error('Could not generate a unique short code, please retry');
}
