import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "bdk_kb_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 hari

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET belum diatur atau terlalu pendek. Atur di environment variable (.env / Vercel)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_DURATION)
    .sign(getSecretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function verifySession(token?: string) {
  try {
    const jwt = token ?? cookies().get(COOKIE_NAME)?.value;
    if (!jwt) return null;
    const { payload } = await jwtVerify(jwt, getSecretKey());
    return payload as { username: string };
  } catch {
    return null;
  }
}

export async function getSessionFromCookieValue(value: string | undefined) {
  return verifySession(value);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

export function checkCredentials(username: string, password: string) {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validUser || !validPass) {
    throw new Error(
      "ADMIN_USERNAME / ADMIN_PASSWORD belum diatur di environment variable."
    );
  }
  return username === validUser && password === validPass;
}
