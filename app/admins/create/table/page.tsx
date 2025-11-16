"use client";

import BackButton from "@/components/element/back";
import { useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateTable() {
    useAuth()
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await api.get("/admins/me");
                if (res.data !== true) {
                    router.replace("/auth/login");
                }
            } catch (err) {
                router.replace("/auth/login");
            }
        };

        checkAdmin();
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableNumber, setTableNumber] = useState<number>();
    const [roomId, setRoomId] = useState<string>("");

    const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/tables/create", {
                number: tableNumber,
                room: roomId,
            });

            alert(`Table ${tableNumber} created successfully for room ${roomId}!`);
        } catch (err) {
            console.error(err);
            alert("Failed to create table!");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen font-sans bg-neutral-900">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />
                <div className="text-neutral-300 backdrop-blur-[2px] flex-1 bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg space-y-4">
                    <p className="font-bold text-xl">Create Table</p>

                    <form onSubmit={submitData}>
                        <div className="m-4 flex space-x-2">
                            <p>Room ID:</p>
                            <input
                                name="roomId"
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Room ID"
                                className="flex-1 ring-1 ring-neutral-700 px-2"
                                required
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Table Number:</p>
                            <input
                                name="number"
                                type="number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(Number(e.target.value))}
                                placeholder="Table number"
                                className="flex-1 ring-1 ring-neutral-700 px-2"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-neutral-200/40 p-2 hover:bg-amber-500/80 rounded font-semibold disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "CREATE"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
