"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { setAccessToken } from "@/api/api";
import { useRouter } from "next/navigation";

type LoginResponse = {
  access_token: string;
};

export default function LoginForm() {
  type LoginFormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setMsg(null);
    setLoading(true);
    try {
      const res = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_BACK_API}/auth/login`,
        { email: data.email, passWd: data.password },
        {withCredentials: true},
      );

      const { access_token } = res.data;
      console.log("res:", res.data);

      setAccessToken(access_token);

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-100/10 hover:bg-neutral-100/15 hover:border-white backdrop-blur-[1px] border-2 border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 w-full sm:w-96 transition-all duration-300 hover:shadow-3xl"
      >
        <h1 className="text-2xl font-bold text-center drop-shadow-md pb-2">
          Login
        </h1>

        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          className="ring-2 ring-neutral-300 hover:ring-blue-400/70 bg-neutral-100/30 p-2 rounded outline-none placeholder-neutral-200 placeholder:text-sm focus:outline-none focus:ring-blue-400/70 focus:placeholder-neutral-100/30"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className="ring-2 ring-neutral-300 hover:ring-blue-400/70 bg-neutral-100/30 p-2 rounded outline-none placeholder-neutral-200 placeholder:text-sm focus:outline-none focus:ring-blue-400/70 focus:placeholder-neutral-100/30"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {msg && (<p className="text-red-500 text-center">{msg}</p>)}

        <button
          type="submit"
          disabled={loading}
          className="bg-neutral-200/40 hover:bg-blue-500/60 py-2 rounded font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
