"use client";

import { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { useRouter } from "next/navigation";
import api from "@/api/api";

export default function TransactionManagement() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");
    const [sort, setSort] = useState<string>("date_desc");

    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showFilter, setShowFilter] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get("/bookings/search", {
                params: {
                    search: search || undefined,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    minPrice: minPrice !== "" ? minPrice : undefined,
                    maxPrice: maxPrice !== "" ? maxPrice : undefined,
                    sort: sort || undefined,
                    page,
                    limit: 4,
                },
            });
            setBookings(res.data.data);
            setTotalPages(res.data.totalPages ?? 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [page]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchBookings();
        }, 300);
        return () => clearTimeout(delay);
    }, [search, startDate, endDate, minPrice, maxPrice, sort]);

    return (
        <div className="flex-1 ml-2">
            {/* Header */}
            <div className="flex justify-between bg-neutral-800/10 p-2">
                <input
                    type="text"
                    placeholder="Search by Booking ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none ring-purple-400 ring-2 p-2 px-4 rounded-full flex-1"
                />

                <div
                    onClick={() => setShowFilter(true)}
                    className="flex-none p-2 hover:bg-purple-400 rounded-full cursor-pointer ml-2"
                >
                    <IoFilter size={24} />
                </div>
            </div>

            {/* Filter Popup */}
            {showFilter && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-neutral-900 p-4 rounded-lg w-96 space-y-4 ring-1 ring-neutral-700">
                        <h2 className="text-lg font-bold text-purple-300">Filter</h2>

                        <div className="flex flex-col space-y-2">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 rounded outline-none ring-purple-400 ring-2"
                            />

                            <label>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 rounded outline-none ring-purple-400 ring-2"
                            />

                            <label>Min Price</label>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) =>
                                    setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                className="p-2 rounded outline-none ring-purple-400 ring-2"
                            />

                            <label>Max Price</label>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) =>
                                    setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                className="p-2 rounded outline-none ring-purple-400 ring-2"
                            />

                            <label>Sort</label>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="p-2 rounded outline-none ring-purple-400 ring-2 text-neutral-900"
                            >
                                <option value="date_asc">Date ↑</option>
                                <option value="date_desc">Date ↓</option>
                                <option value="price_asc">Price ↑</option>
                                <option value="price_desc">Price ↓</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowFilter(false)}
                                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setPage(1);
                                    fetchBookings();
                                    setShowFilter(false);
                                }}
                                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking list */}
            <div className="mt-4 space-y-3">
                {loading && <p>Loading...</p>}
                {!loading && bookings.length === 0 && <p>No bookings found</p>}
                {!loading &&
                    bookings.map((b) => (
                        <div
                            key={b._id}
                            onClick={() => router.push(`/admins/manage/transaction?bookingId=${b._id}`)}
                            className="bg-neutral-800/40 p-3 rounded-lg ring-1 ring-neutral-700 cursor-pointer flex justify-between"
                        >
                            <div>
                                <p className="font-bold text-lg text-purple-300">
                                    Booking ID: {b._id}
                                </p>
                                <p>User: {b.userId?.userName}</p>
                                <p>Boardgame: {b.boardgameId?.name}</p>
                                <p>Room: {b.room?.number}</p>
                                <p>Table: {b.table?.number}</p>
                                <p>Amount: {b.amount} Bath</p>
                                <p>Status: {b.status}</p>
                                <p>
                                    Start: {new Date(b.startTime).toLocaleString()} | End:{" "}
                                    {new Date(b.endTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-6 text-neutral-300">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-4 py-2 rounded-md ${page <= 1 ? "bg-neutral-700" : "bg-neutral-600 hover:bg-neutral-500"
                        }`}
                >
                    Previous
                </button>

                <p>
                    Page {page} / {totalPages}
                </p>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-md ${page >= totalPages ? "bg-neutral-700" : "bg-neutral-600 hover:bg-neutral-500"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
