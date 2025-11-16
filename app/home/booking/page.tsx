"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { TbCircleArrowRightFilled } from "react-icons/tb";
import BackButton from "@/components/element/back";
import { useSearchParams } from "next/navigation";
import api from "@/api/api";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/guard/require_login";
import DatePicker from "react-datepicker";
import { FaCircle } from "react-icons/fa";

interface Booking {
    room: { _id: string; name?: string };
    table: { _id: string; name?: string };
    startTime: string;
    endTime: string;
}

export default function Booking() {
    useAuth();

    const searchParams = useSearchParams();
    const boardgameId = searchParams.get("boardgameId");

    const [gameName, setGameName] = useState<string>("");
    const [game, setGame] = useState<any>(null);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    const [rooms, setRooms] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);

    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [availableTables, setAvailableTables] = useState<any[]>([]);

    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [selectedTable, setSelectedTable] = useState<string>("");

    useEffect(() => {
        if (!boardgameId) return;
        fetchBoardgame(boardgameId);
        fetchRooms();
        fetchTables();
    }, [boardgameId]);

    const fetchBoardgame = async (id: string) => {
        try {
            const res = await api.get(`/board-games/search`, {
                params: { search: id },
            });
            if (res.data.data.length > 0) {
                const g = res.data.data[0];
                setGame(g);
                setGameName(g.name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await api.get("/rooms");
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTables = async () => {
        try {
            const res = await api.get("/tables");
            setTables(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!startTime || !endTime) return;

        const fetchAvailable = async () => {
            let params: any = {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            };
            if (selectedRoom) params.room = selectedRoom;
            if (selectedTable) params.table = selectedTable;

            try {
                const res = await api.get("/bookings/search-booked-time", { params });
                const booked: Booking[] = res.data.data;

                const bookedRoomIds = booked.map((b: Booking) => b.room._id);
                const bookedTableIds = booked.map((b: Booking) => b.table._id);

                setAvailableRooms(rooms.filter((r) => !bookedRoomIds.includes(r._id)));
                setAvailableTables(tables.filter((t) => !bookedTableIds.includes(t._id)));
            } catch (err) {
                console.error(err);
            }
        };

        fetchAvailable();
    }, [startTime, endTime, rooms, tables, selectedRoom, selectedTable]);

    return (
        <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />
                <div className="flex-1">
                    <div className="bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 p-2 rounded-xl flex space-x-1">
                        <p>Booking :</p>
                        <p>{gameName}</p>
                    </div>

                    <div className="bg-neutral-800/10 hover:bg-neutral-800/50 hover:ring-neutral-300 ring-2 ring-neutral-400 p-2 rounded-xl flex space-x-1 mt-8 flex-col">
                        <div className="mx-auto mt-2">
                            <div className="flex justify-end">
                                <p>
                                    {game?.is_available ? (
                                        <FaCircle className="text-green-400" />
                                    ) : (
                                        <FaCircle className="text-red-400" />
                                    )}
                                </p>
                            </div>
                            {game?.pic?.secure_url && (
                                <Image
                                    src={game.pic.secure_url}
                                    width={200}
                                    height={200}
                                    alt={game.name}
                                />
                            )}
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="flex">
                                <p className="font-semibold w-24">Category :</p>
                                <p>{game?.category ?? "-"}</p>
                            </div>
                            <div></div>
                            <div className="flex justify-start">
                                <p className="font-semibold w-24">Price :</p>
                                <p>{game?.price ? `${game.price} ฿` : "-"}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-24">Mechanic :</p>
                                <p>{game?.mechanic ?? "-"}</p>
                            </div>
                            <div></div>
                            <div className="flex">
                                <p className="font-semibold w-24">Amount :</p>
                                <p>{game?.amount ?? "-"}</p>
                            </div>
                            <div className="flex col-span-3">
                                <p className="font-semibold w-24">Details :</p>
                                <p>{game?.description ?? "-"}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Start Time:</label>
                                <DatePicker
                                    selected={startTime}
                                    onChange={(date) => setStartTime(date)}
                                    showTimeSelect
                                    timeIntervals={60}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">End Time:</label>
                                <DatePicker
                                    selected={endTime}
                                    onChange={(date) => setEndTime(date)}
                                    showTimeSelect
                                    timeIntervals={60}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={startTime || new Date()}
                                    className="w-full border rounded p-2"
                                    disabled={!startTime}
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Room:</label>
                                <select
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    className="w-full border rounded p-2 "
                                    disabled={!startTime || !endTime}
                                >
                                    <option value="" className="text-black">Select Room</option>
                                    {availableRooms.map((r) => (
                                        <option className="text-black" key={r._id} value={r._id}>
                                            {r.number}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Table:</label>
                                <select
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                    className="w-full border rounded p-2"
                                    disabled={!startTime || !endTime}
                                >
                                    <option value="" className="text-black">Select Table</option>
                                    {availableTables.map((t) => (
                                        <option className="text-black" key={t._id} value={t._id}>
                                            {t.number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={async () => {
                                if (!startTime || !endTime || !selectedRoom || !selectedTable || !boardgameId) {
                                    alert("Please select all required fields");
                                    return;
                                }

                                try {
                                    const res = await api.post("/holding-bookings/create", {
                                        startTime: startTime.toISOString(),
                                        endTime: endTime.toISOString(),
                                        boardgameId: boardgameId,
                                        room: selectedRoom,
                                        table: selectedTable,
                                    });
                                    alert(res.data.message);
                                    window.location.href = `/home/booking/confirm-booking?bookingId=${res.data.bookingId}&amount=${res.data.amount}`;
                                } catch (err: any) {
                                    console.error(err);
                                    alert(err.response?.data?.message || "Failed to create holding booking");
                                }
                            }}
                            className="bg-neutral-400 flex p-2 text-neutral-800 hover:bg-blue-300 rounded-md shadow-lg hover:shadow-white/30"
                        >
                            <p>Next</p>
                            <div className="ml-2 mt-1">
                                <TbCircleArrowRightFilled />
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
