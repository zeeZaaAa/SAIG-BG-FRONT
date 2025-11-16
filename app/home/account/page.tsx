"use client";

import { useState } from "react";
import ProfileConfig from "@/components/accounts/profile";
import BookingHistory from "@/components/accounts/booking-history";
import BackButton from "@/components/element/back";


export default function Profile() {
    const [currentPage, setCurrentPage] = useState<String>("profile")

    return (
        <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />
                <div className="text-neutral-300 backdrop-blur-[2px] flex-1 bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg  focus:bg-neutral-800/50  focus:ring-neutral-300 flex space-x-3">
                    <div className="text-lg flex-none">
                        <p className="text-2xl mb-1 text-neutral-200 font-bold">
                            Account
                        </p>
                        <div className="flex flex-col space-y-2 border-t-2 border-neutral-700 pt-4">
                            <p onClick={() => setCurrentPage("profile")} className="cursor-pointer">
                                profile
                            </p>
                            <p onClick={() => setCurrentPage("booking")} className="cursor-pointer">
                                booking
                            </p>
                        </div>
                    </div>
                    <div className="border-l-2 text-md flex justify-center border-neutral-400 flex-1">
                        {
                            currentPage === "profile" && (
                                <ProfileConfig />
                            )
                        }
                        {
                            currentPage === "booking" && (
                                <div className="flex justify-center">
                                    <BookingHistory />
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}