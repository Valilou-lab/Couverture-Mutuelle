/**
 * WebOTP API (Android Chrome) — not in default TypeScript DOM lib yet.
 * @see https://web.dev/articles/web-otp
 */
interface OTPCredential extends Credential {
  readonly code: string;
}

interface CredentialRequestOptions {
  otp?: {
    transport: Array<"sms">;
  };
}

interface Window {
  OTPCredential?: {
    new (): OTPCredential;
    prototype: OTPCredential;
  };
}
