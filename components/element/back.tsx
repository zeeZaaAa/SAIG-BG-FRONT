"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function BackButton() {
    const router = useRouter();
    
    return (
        <div onClick={() => router.back()} className="text-4xl bg-neutral-400/10 hover:ring-neutral-600 p-1 ring-2 ring-neutral-700 rounded-full hover:text-blue-400 text-blue-300">
            <IoIosArrowRoundBack />
        </div>
    );
}