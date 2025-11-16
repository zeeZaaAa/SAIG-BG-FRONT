"use client";

import { useEffect, useState } from "react";
import api from "@/api/api";
import { format } from "date-fns";

interface Booking {
  _id: string;
  boardgameId: { name: string };
  room: { number: string };
  table: { number: string };
  startTime: string;
  endTime: string;
  amount: number;
  status: "refunded" | "paid" | "cancelled";
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/me");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        alert("Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.post(`/bookings/cancel/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      alert("Booking cancelled successfully");
    } catch (err: any) {
      console.error("Cancel booking error:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-blue-600">Loading booking history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 text-sm">
      <h1 className="text-xl font-bold text-blue-500 mb-2">Booking History</h1>

      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((b) => (
        <div
          key={b._id}
          className="bg-neutral-800/10 hover:bg-neutral-800/50 ring-1 ring-blue-300 p-3 rounded-lg flex flex-wrap items-center gap-3"
        >
          <span><strong>Boardgame:</strong> {b.boardgameId.name}</span>
          <span><strong>Room:</strong> {b.room.number}</span>
          <span><strong>Table:</strong> {b.table.number}</span>
          <span><strong>Start:</strong> {format(new Date(b.startTime), "dd/MM/yyyy HH:mm")}</span>
          <span><strong>End:</strong> {format(new Date(b.endTime), "dd/MM/yyyy HH:mm")}</span>
          <span><strong>Amount:</strong> {b.amount} ฿</span>
          <span>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                b.status === "paid"
                  ? "text-green-500"
                  : b.status === "cancelled"
                  ? "text-yellow-500"
                  : "text-red-500"
              } font-semibold`}
            >
              {b.status.toUpperCase()}
            </span>
          </span>

          {b.status === "paid" && (
            <button
              onClick={() => handleCancel(b._id)}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md text-xs"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
