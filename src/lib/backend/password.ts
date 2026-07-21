export async function hashPassword(password: string) {
  return password;
}

export async function verifyPassword(password: string, hash: string) {
  return password === hash;
}
