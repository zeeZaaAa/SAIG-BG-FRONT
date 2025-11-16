"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { nameRegex, passwordRegex } from "./signupValidators";

export default function SignUpForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [backMsg, setBackMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  type RegisterFormData = {
    userName: string;
    email: string;
    passWd: string;
    confirmPassWd: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    data.userName = data.userName.trim();
    setEmail(data.email);

    if (!nameRegex.test(data.userName)) {
      return setError("userName", {
        type: "manual",
        message: "userName must be only English letters (2–30 chars)",
      });
    }

    if (!passwordRegex.test(data.passWd)) {
      return setError("passWd", {
        type: "manual",
        message:
          "Password must be a-z A-Z 0-9, at least 8 characters, and no spaces",
      });
    }

    try {
      const payload = {
        email: data.email.trim(),
        userName: data.userName,
        passWd: data.passWd,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_API}/auth/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        setShowPopup(true);
        setBackMsg(res.data.message);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) setMsg(err.response.data.message);
      else setMsg("Unknown error occurred");
    }
  };

  const password = watch("passWd");

  return (
    <div className="mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-100/10 hover:bg-neutral-100/15 backdrop-blur-[1px] border-2 border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 w-full sm:w-96 transition-all duration-300 hover:shadow-3xl hover:border-white"
      >
        <h1 className="text-2xl font-bold text-center drop-shadow-md">Sign Up</h1>

        <input {...register("userName", { required: "Name is required" })} placeholder="Name" className="p-2 rounded ring-2 ring-neutral-300" />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}

        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
          type="email"
          placeholder="Email"
          className="p-2 rounded ring-2 ring-neutral-300"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          {...register("passWd", {
            required: "Password is required",
            minLength: { value: 8, message: "Min length is 8" },
          })}
          type="password"
          placeholder="Password"
          className="p-2 rounded ring-2 ring-neutral-300"
        />
        {errors.passWd && <p className="text-red-500 text-sm">{errors.passWd.message}</p>}

        <input
          {...register("confirmPassWd", {
            required: "Confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          type="password"
          placeholder="Confirm Password"
          className="p-2 rounded ring-2 ring-neutral-300"
        />
        {errors.confirmPassWd && (
          <p className="text-red-500 text-sm">{errors.confirmPassWd.message}</p>
        )}

        {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition-all"
        >
          Sign Up
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center shadow-xl text-neutral-900">
            <h2 className="text-xl font-bold mb-2">Check your inbox!</h2>
            <p>{backMsg}</p>
            <p className="text-sm mt-2 text-neutral-700">Email: {email}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
