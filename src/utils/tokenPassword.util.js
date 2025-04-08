import bcrypt from "bcrypt";
import crypto from "crypto";

export async function generateResetToken() {
  const token = crypto.randomBytes(16).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const expires = Date.now() + 3600000;
  return { token, tokenHash, expires };
}
