"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_API}/auth/verify-email/${token}`
        );

        setMessage("Email verified successfully! You may now login.");
      } catch (err: any) {
        const msg =
          err.response?.data?.message || "Something went wrong during verification.";
        setMessage(`Verification failed: ${msg}`);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-900 text-white">
      <p className="text-xl text-center">{message}</p>
    </div>
  );
}
