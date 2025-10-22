import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// کلید 32 بایتی از env (Base64)
const KEY = Buffer.from(process.env.NOTE_ENC_KEY!, "base64");
if (KEY.length !== 32) throw new Error("NOTE_ENC_KEY must be 32 bytes (base64).");

/* ---------------------------------------------
  AES-GCM برای متن (username یا متن نوت)
  - IV: 12 بایت تصادفی
  - خروجی: iv.ciphertext.tag (Base64 جدا با ".")
--------------------------------------------- */
/**
 * Encrypts a string using AES-256-GCM.
 * @param {string} plain - The string to encrypt.
 * @returns {string} The encrypted string, formatted as "iv.ciphertext.tag".
 */
export function encryptText(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);

  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString("base64"), ciphertext.toString("base64"), tag.toString("base64")].join(".");
}

/**
 * Decrypts a string that was encrypted with `encryptText`.
 * @param {string} packed - The encrypted string, formatted as "iv.ciphertext.tag".
 * @returns {string} The decrypted string.
 */
export function decryptText(packed: string): string {
  const [ivB64, ctB64, tagB64] = packed.split(".");
  if (!ivB64 || !ctB64 || !tagB64) throw new Error("Malformed encrypted payload.");

  const iv = Buffer.from(ivB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");
  const tag = Buffer.from(tagB64, "base64");

  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);

  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}

/* ---------------------------------------------
  AES-CBC برای ایمیل (deterministic)
  - IV ثابت (برای اینکه همیشه خروجی یکسان باشد)
  - خروجی: Base64
--------------------------------------------- */
const IV_EMAIL = Buffer.alloc(16, 0); // 16 بایت صفر

/**
 * Encrypts an email address using AES-256-CBC.
 * This is deterministic, meaning the same email will always encrypt to the same value.
 * @param {string} email - The email address to encrypt.
 * @returns {string} The encrypted email address, as a base64 string.
 */
export function encryptEmail(email: string): string {
  const cipher = createCipheriv("aes-256-cbc", KEY, IV_EMAIL);
  const encrypted = Buffer.concat([cipher.update(email, "utf8"), cipher.final()]);
  return encrypted.toString("base64");
}

/**
 * Decrypts an email address that was encrypted with `encryptEmail`.
 * @param {string} enc - The encrypted email address, as a base64 string.
 * @returns {string} The decrypted email address.
 */
export function decryptEmail(enc: string): string {
  const decipher = createDecipheriv("aes-256-cbc", KEY, IV_EMAIL);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(enc, "base64")), decipher.final()]);
  return decrypted.toString("utf8");
}
