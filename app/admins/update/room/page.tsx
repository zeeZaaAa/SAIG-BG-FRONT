"use client";

import BackButton from "@/components/element/back";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";
import { useRouter } from "next/navigation";

export default function UpdateRoom() {
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

    const params = useSearchParams();
    const roomId = params.get('roomId');

    const [loading, setLoading] = useState<boolean>(false);

    const [editNumber, setEditNumber] = useState<boolean>(false);
    const [editTotalTable, setEditTotalTable] = useState<boolean>(false);

    const [id, setID] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [totalTables, setTotalTables] = useState<string>("");

    // Load existing room
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get("/rooms/search", {
                    params: { search: roomId },
                });

                const room = res.data.data[0];
                if (!room) return;

                setID(room._id);
                setNumber(room.number.toString());
                setTotalTables(room.totalTables.toString());
            } catch (err) {
                console.error(err);
            }
        };

        fetchRoom();
    }, [roomId]);

    const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(`/rooms/patch/${id}`, {
                number: Number(number),
                totalTables: Number(totalTables),
            });

            alert("Room updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen font-sans bg-neutral-900">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />
                <div className="text-neutral-300 backdrop-blur-[2px] flex-1 bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg space-y-4">
                    <p className="font-bold text-xl">Update Room</p>

                    <form onSubmit={submitData}>
                        {/* ID */}
                        <div className="m-4 flex space-x-2 items-center">
                            <p>ID: {id}</p>
                        </div>

                        {/* Number */}
                        <div className="m-4 flex space-x-2 items-center">
                            {!editNumber ? (
                                <>
                                    <p>Number: {number}</p>
                                    <FaPen className="cursor-pointer" onClick={() => setEditNumber(true)} />
                                </>
                            ) : (
                                <>
                                    <p>Number:</p>
                                    <input
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        type="number"
                                        className="flex-1 ring-1 ring-neutral-700 px-2"
                                    />
                                    <IoCheckmark className="cursor-pointer" onClick={() => setEditNumber(false)} />
                                </>
                            )}
                        </div>

                        {/* Total Tables */}
                        <div className="m-4 flex space-x-2 items-center">
                            {!editTotalTable ? (
                                <>
                                    <p>Total Tables: {totalTables}</p>
                                    <FaPen className="cursor-pointer" onClick={() => setEditTotalTable(true)} />
                                </>
                            ) : (
                                <>
                                    <p>Total Tables:</p>
                                    <input
                                        value={totalTables}
                                        onChange={(e) => setTotalTables(e.target.value)}
                                        type="number"
                                        className="flex-1 ring-1 ring-neutral-700 px-2"
                                    />
                                    <IoCheckmark className="cursor-pointer" onClick={() => setEditTotalTable(false)} />
                                </>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-neutral-200/40 p-2 hover:bg-amber-500/80 rounded font-semibold disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "SAVE"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
