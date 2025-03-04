"use server";

import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

const TEST_CREDENTIALS = [
  { email: "student@test.com", password: "test123", role: "student" },
  { email: "org@test.com", password: "test123", role: "organization" }
];

export async function login(_, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login Attempt:", email);

  let errors = {};

  if (!email) {
    errors.email = ["Email is required"];
  }
  if (!password) {
    errors.password = ["Password is required"];
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const user = TEST_CREDENTIALS.find((cred) => cred.email === email);
  if (!user || user.password !== password) {
    return { errors: { general: "Invalid email or password" } };
  }

  console.log("User found, creating session...");
  await createSession(user.email, user.role);
  redirect("/");
}
