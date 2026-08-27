const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

// Verifies a Cloudflare Turnstile token server-side, per Cloudflare's own
// docs (the token must always be checked by the backend, never trusted from
// the client alone). Falls back to allowing the request through — logged by
// the caller — when TURNSTILE_SECRET_KEY isn't configured, so local dev/testing
// isn't blocked on having real Cloudflare credentials.
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return true;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) {
    body.append('remoteip', remoteIp);
  }

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    const data = (await res.json()) as TurnstileVerifyResponse;
    return data.success;
  } catch {
    return false;
  }
}
