"use client";

import { useState } from "react";
import { ImExit } from "react-icons/im";
import BoardgameConf from "@/components/admins/boardgameConf";
import RoomConf from "@/components/admins/roomConf";
import TransacMa from "@/components/admins/transacMa";
import { useAuth } from "@/guard/require_login";
import api from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/api/api";
import TableConf from "@/components/admins/tableConf";


export default function AdminDashboard() {
    useAuth()

    const [currentPage, setCurrentPage] = useState<String>("boardgame");

    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await api.get("/admins/me", {
                    withCredentials: true
                });

                if (res.data !== true) {
                    router.replace("/auth/login");
                }
            } catch (err) {
                router.replace("/auth/login");
            }
        };

        checkAdmin();
    }, []);

    return (
        <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">
            <div className="flex items-start mx-auto max-w-5xl pt-10 space-x-5">
                <div className="text-neutral-300 flex-1 backdrop-blur-[2px] bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg  focus:bg-neutral-800/50  focus:ring-neutral-300 flex space-x-3">
                    <div className="text-lg flex-none">
                        <p className="text-2xl mb-1 text-neutral-200 font-bold">
                            ADMIN
                        </p>
                        <div className="flex flex-col space-y-2 border-t-2 border-neutral-700 pt-4">
                            <p onClick={() => setCurrentPage("boardgame")} className="cursor-pointer">
                                board game config
                            </p>
                            <p onClick={() => setCurrentPage("room")} className="cursor-pointer">
                                room config
                            </p>
                            <p onClick={() => setCurrentPage("table")} className="cursor-pointer">
                                table config
                            </p>
                            <p onClick={() => setCurrentPage("transaction")} className="cursor-pointer">
                                transaction management
                            </p>
                        </div>
                    </div>
                    <div className="border-l-2 text-md flex justify-center border-neutral-400 flex-1">
                        {
                            currentPage === "boardgame" && (
                                <BoardgameConf />
                            )
                        }
                        {
                            currentPage === "room" && (

                                <RoomConf />

                            )
                        }
                        {
                            currentPage === "transaction" && (
                                <TransacMa />
                            )
                        }
                        {
                            currentPage === "table" && (
                                <TableConf />
                            )
                        }
                    </div>
                </div>
                <div onClick={logout} className="mt-1 hover:text-red-500 rounded-full">
                    <ImExit />
                </div>
            </div>
        </div>
    )
}