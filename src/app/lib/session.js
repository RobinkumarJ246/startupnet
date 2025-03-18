import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is missing in .env.local");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(email, role) {
  console.log("Creating session for:", email, role);
  
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ email, role, expiresAt });

  console.log("Generated JWT:", session);

  // Fix: Await cookies() before calling .set()
  const cookieStore = await cookies(); 
  cookieStore.set("session", session, {
    // httpOnly: true,
    expires: expiresAt,
    path: "/",
  });

  console.log("Session Cookie Set");
}

export async function deleteSession() {
  console.log("Deleting session...");
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt() {
  const cookieStore = await cookies(); 
  const session = cookieStore.get("session")?.value;

  if (!session) {
    console.log("No session cookie found");
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log("Session decrypted:", payload);
    return payload;
  } catch (error) {
    console.log("Failed to verify session:", error.message);
    return null;
  }
}
