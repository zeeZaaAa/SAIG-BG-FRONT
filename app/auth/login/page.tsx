import LoginForm from "../../../components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
};


export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans ">
      <div>
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-zinc-50">
          Login Page
        </h1>
      </div>
      <main className="flex w-full max-w-3xl items-center justify-between py-32 px-16 bg-black sm:items-start text-neutral-300">
        <LoginForm />
      </main>
    </div>
  );
}