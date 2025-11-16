"use server";

import { redirect } from "next/navigation";

export async function handleSubmit(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "admin@example.com" && password === "1234") {
    redirect("/dashboard"); 
  }
  return { error: "Invalid credentials" };
}
