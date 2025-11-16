"use client";

import { GoSearch } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/api/api";

export default function Nav() {

    return (
        <nav className="flex justify-between text-neutral-800 px-16 py-2">
            <div className="flex space-x-1.5">
                <div className="rounded-full overflow-hidden w-10 h-10 mt-1">
                    <Image
                        src="/SAIG-ICON.jpg"
                        alt="Picture of the SAIG"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
                <div className="mt-3">
                    <p>Board Games</p>
                </div>
            </div>

            <div className="flex text-sm p-2 space-x-3">
                <Link href='/home/view-all-boardgame' className="px-1.5 flex bg-neutral-800 rounded-lg text-neutral-100 p-1 space-x-1 mt-px cursor-pointer">
                    <GoSearch className="mt-0.75" />
                    <p className="text-[13px] mt-px mr-px">search</p>
                </Link>
                <div>
                    <Link href="/home/account">
                        <p className="mt-1">Account</p>
                    </Link>
                </div>
                <div>
                    <div onClick={logout} className="cursor-pointer">
                        <p className="mt-1">log out</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}