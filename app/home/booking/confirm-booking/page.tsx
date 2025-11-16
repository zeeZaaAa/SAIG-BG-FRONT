"use client";

import { useState, useEffect } from "react";
import { RiBookmarkFill } from "react-icons/ri";
import Link from "next/link";
import BackButton from "@/components/element/back";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/payment/checkoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Booking {
    _id: string;
    boardgameId: { name: string };
    room: { number: string };
    table: { number: string };
    startTime: string;
    endTime: string;
    amount: number;
}

export default function ConfirmBooking() {
    useAuth();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const router = useRouter();

    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!bookingId) return;

        const fetchBooking = async () => {
            try {
                const res = await api.get(`/holding-bookings/${bookingId}`);
                const bookingData = {
                    ...res.data,
                    startTime: new Date(res.data.startTime),
                    endTime: new Date(res.data.endTime),
                };
                setBooking(bookingData);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch booking details");
                router.push("/home");
            }
        };

        fetchBooking();
    }, [bookingId, router]);

    if (!booking) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-900">
                <p className="text-white animate-pulse">Loading booking...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-neutral-900 p-4">
            <div className="flex items-start w-full max-w-3xl mx-auto space-x-10 pt-10">
                <BackButton />
                <div className="flex-1">

                    <div className="bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-blue-400 ring-2 ring-blue-300 p-2 rounded-xl flex space-x-2 text-lg">
                        <p>Confirm Booking :</p>
                        <p>{booking.boardgameId.name}</p>
                    </div>

                    <div className="bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-blue-400 ring-2 ring-blue-300 p-4 rounded-xl flex flex-col mt-8">
                        <p className="text-lg font-semibold mb-2">Details:</p>
                        <ul className="space-y-1 ml-4 text-white">
                            <li>
                                <span className="font-medium">Room:</span> {booking.room.number}
                            </li>
                            <li>
                                <span className="font-medium">Table:</span> {booking.table.number}
                            </li>
                            <li>
                                <span className="font-medium">Start:</span>{" "}
                                {booking.startTime.toLocaleString()}
                            </li>
                            <li>
                                <span className="font-medium">End:</span>{" "}
                                {booking.endTime.toLocaleString()}
                            </li>
                            <li>
                                <span className="font-medium">Amount:</span> {booking.amount} ฿
                            </li>
                        </ul>

                        <div className="mt-6">
                            <Elements stripe={stripePromise}>
                                <CheckoutForm bookingId={booking._id} amount={booking.amount} />
                            </Elements>
                        </div>

                        <p className="text-center text-sm text-red-500 mt-4">
                            *Booking is held for 10 minutes. Please confirm.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
