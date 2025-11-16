"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "@/api/api";

interface Props {
    bookingId: string;
    amount: number;
}

export default function CheckoutForm({ bookingId, amount }: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!amount) return;
        const createPaymentIntent = async () => {
            try {
                const { data } = await api.post(
                    `/holding-bookings/createPaymentIntent`,
                    { amount, bookingId }
                );
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("Failed to create payment intent:", err);
                alert("Failed to initialize payment. Please try again.");
            }
        };
        createPaymentIntent();
    }, [amount, bookingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement)! },
        });

        if (result.error) {
            console.error(result.error.message);
            alert(result.error.message);
        } else if (result.paymentIntent?.status === "succeeded") {
            try {
                await api.post(`/bookings/create`, { holding_booking_id: bookingId });
                alert("Booking confirmed successfully!");
                window.location.href = "/home"; 
            } catch (err: any) {
                console.error("Failed to confirm booking:", err);
                alert(err.response?.data?.message || "Failed to confirm booking");
            }
        }

        setLoading(false);
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mx-auto p-4 bg-neutral-800 rounded-lg space-y-4"
        >
            <div className="border p-3 rounded-md">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#fff",
                                "::placeholder": { color: "#ccc" },
                            },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : `Pay ${amount} ฿`}
            </button>
        </form>
    );
}
