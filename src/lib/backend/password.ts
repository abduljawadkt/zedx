import crypto from "node:crypto";

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  if (!storedHash.startsWith("pbkdf2$")) {
    return password === storedHash;
  }

  const [, iterationsValue, salt, hash] = storedHash.split("$");
  const iterations = Number(iterationsValue);
  if (!iterations || !salt || !hash) return false;

  const calculated = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST);
  const expected = Buffer.from(hash, "hex");
  return calculated.length === expected.length && crypto.timingSafeEqual(calculated, expected);
}
