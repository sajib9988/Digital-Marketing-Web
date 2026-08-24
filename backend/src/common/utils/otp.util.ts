import { randomInt, createHash } from 'crypto';

// OTPs are short-lived (minutes) and rate-limited, so a fast SHA-256 hash at
// rest is sufficient — unlike passwords, which need slow hashing to resist
// offline brute-forcing over a much longer useful lifetime.
export const generateOtp = (): string =>
  randomInt(0, 1_000_000).toString().padStart(6, '0');

export const hashOtp = (code: string): string =>
  createHash('sha256').update(code).digest('hex');

export const compareOtp = (code: string, hash: string): boolean =>
  hashOtp(code) === hash;
