"use client";

import BackButton from "@/components/element/back";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";

export default function UpdateBooking() {
    useAuth()

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
    const router = useRouter();
    const bookingId = params.get("bookingId");

    const [loading, setLoading] = useState(false);

    // Editable fields
    const [status, setStatus] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Read-only fields
    const [userName, setUserName] = useState("");
    const [boardgameName, setBoardgameName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [stripeId, setStripeId] = useState("");

    useEffect(() => {
        if (!bookingId) return;

        const fetchBooking = async () => {
            try {
                const res = await api.get("/bookings/search", { params: { search: bookingId } });
                const booking = res.data.data[0];
                if (!booking) return;

                // Editable
                setStatus(booking.status);
                setAmount(booking.amount);
                setStartTime(new Date(booking.startTime).toISOString().slice(0, 16));
                setEndTime(new Date(booking.endTime).toISOString().slice(0, 16));

                // Read-only
                setUserName(booking.userId?.userName || "");
                setBoardgameName(booking.boardgameId?.name || "");
                setRoomNumber(booking.room?.number || "");
                setTableNumber(booking.table?.number || "");
                setStripeId(booking.stripePaymentIntentId);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!bookingId) return;
        setLoading(true);

        try {
            await api.patch(`/bookings/update/${bookingId}`, {
                status,
                amount: amount === "" ? undefined : amount,
                startTime,
                endTime
            });
            alert("Booking updated successfully!");
            router.back();
        } catch (err) {
            console.error(err);
            alert("Failed to update booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />

                <div className="text-neutral-300 flex-1 bg-neutral-800/10 hover:bg-neutral-800/50 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg">
                    <p className="font-bold text-xl">Update Booking</p>

                    <form onSubmit={submitUpdate} className="space-y-4 mt-4">
                        {/* Read-only */}
                        <div className="m-4 flex space-x-2">
                            <p>User :</p>
                            <p className="flex-1">{userName}</p>
                        </div>
                        <div className="m-4 flex space-x-2">
                            <p>Boardgame :</p>
                            <p className="flex-1">{boardgameName}</p>
                        </div>
                        <div className="m-4 flex space-x-2">
                            <p>Room :</p>
                            <p className="flex-1">{roomNumber}</p>
                        </div>
                        <div className="m-4 flex space-x-2">
                            <p>Table :</p>
                            <p className="flex-1">{tableNumber}</p>
                        </div>
                        <div className="m-4 flex space-x-2">
                            <p>Stripe ID :</p>
                            <p className="flex-1">{stripeId}</p>
                        </div>

                        {/* Editable */}
                        <div className="m-4 flex space-x-2">
                            <p>Status :</p>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="flex-1 ring-1 ring-neutral-700 rounded p-1"
                            >
                                <option value="paid">Paid</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Amount :</p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                className="flex-1 ring-1 ring-neutral-700 rounded p-1"
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Start Time :</p>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="flex-1 ring-1 ring-neutral-700 rounded p-1"
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>End Time :</p>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="flex-1 ring-1 ring-neutral-700 rounded p-1"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-neutral-200/40 p-2 hover:bg-purple-500/60 rounded font-semibold disabled:opacity-50"
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
