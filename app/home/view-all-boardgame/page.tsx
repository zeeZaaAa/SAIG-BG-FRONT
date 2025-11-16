"use client";

import { IoFilter } from "react-icons/io5";
import { RiGeminiFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";
import qs from 'qs';
import { useRouter } from "next/navigation";

interface BoardGame {
    _id: string;
    name: string;
    price: number;
    pic?: { secure_url: string };
    category?: string[];
    mechanic?: string[];
}

export default function ViewAllBoardGame() {
    useAuth()

    const router = useRouter();

    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [boardGames, setBoardGames] = useState<BoardGame[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // สำหรับ filter & sort
    const [selectedSort, setSelectedSort] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<string[]>([]);

    // Temp input values
    const [categoryInput, setCategoryInput] = useState<string>("");
    const [mechanicInput, setMechanicInput] = useState<string>("");

    const fetchBoardGames = async () => {
        try {
            const params: any = {
                search,
                page,
                page_size: 5,
                sort: selectedSort[0],
                category: selectedCategory,
                mechanic: selectedMechanic,
            };

            const res = await api.get("/board-games/search", { params, paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) });
            setBoardGames(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch board games:", err);
        }
    };

    useEffect(() => {
        fetchBoardGames();
    }, [search, page, selectedSort, selectedCategory, selectedMechanic]);

    const toggleSort = (sort: string) => {
        setSelectedSort((prev) =>
            prev.includes(sort) ? prev.filter((s) => s !== sort) : [sort]
        );
    };

    const addCategory = () => {
        if (categoryInput.trim() && !selectedCategory.includes(categoryInput.trim())) {
            setSelectedCategory([...selectedCategory, categoryInput.trim()]);
        }
        setCategoryInput("");
    };

    const addMechanic = () => {
        if (mechanicInput.trim() && !selectedMechanic.includes(mechanicInput.trim())) {
            setSelectedMechanic([...selectedMechanic, mechanicInput.trim()]);
        }
        setMechanicInput("");
    };

    const removeCategory = (cat: string) => {
        setSelectedCategory(selectedCategory.filter((c) => c !== cat));
    };

    const removeMechanic = (mech: string) => {
        setSelectedMechanic(selectedMechanic.filter((m) => m !== mech));
    };

    return (
        <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-20">
                <div className="flex bg-neutral-900/10 backdrop-blur-[2px] p-10 justify-between space-x-15 text-neutral-300">
                    <Link href="/home" className="flex space-x-2">
                        <div className="rounded-full overflow-hidden w-10 h-10 mt-3">
                            <Image
                                src="/SAIG-ICON.jpg"
                                alt="SAIG"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div className="mt-5 flex-none">
                            <p>Board Games</p>
                        </div>
                    </Link>

                    <div className="flex bg-neutral-500/10 hover:bg-neutral-500/20 ring-2 group focus-within:ring-purple-400 hover:ring-purple-400 p-5 rounded-full flex-auto ring-blue-100 hover:shadow-lg  transition-all shadow-2xl shadow-white/50">
                        <div className="mt-0.5 text-xl text-white mr-2 group-hover:text-purple-300 group-focus-within:text-purple-300">
                            <RiGeminiFill />
                        </div>
                        <div className="flex-1 flex">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search"
                                className="outline-none flex-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="mt-2 mb-3 text-xl bg-neutral-500/30 p-3 rounded-full flex-none ring-blue-100 ring-2 hover:ring-blue-400 hover:text-blue-400"
                    >
                        <IoFilter />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-40 px-10 flex flex-col space-y-3">
                {boardGames.length === 0 && (
                    <p className="text-white col-span-full">No board games found.</p>
                )}
                {boardGames.map((bg) => (
                    <div
                        key={bg._id}
                        className="bg-neutral-800 p-4 rounded-xl shadow-lg hover:shadow-blue-300/50 transition-all flex items-center space-x-4 cursor-pointer"
                        onClick={() => router.push(`/home/booking?boardgameId=${bg._id}`)}
                    >
                        <div className="flex rounded-lg overflow-hidden w-32 h-32 shrink-0">
                            <Image
                                src={bg.pic?.secure_url || "/SAIG-ICON.jpg"}
                                alt={bg.name}
                                width={64}   
                                height={64} 
                                className="object-cover flex-1"
                            />
                        </div>

                        <div className="flex flex-col justify-center flex-1">
                            <p className="text-white font-bold text-lg">{bg.name}</p>
                            <p className="text-blue-400 font-semibold">${bg.price}</p>
                            {bg.category && (
                                <p className="text-neutral-400 text-sm truncate">Category: {bg.category}</p>
                            )}
                            {bg.mechanic && (
                                <p className="text-neutral-400 text-sm truncate">Mechanic: {bg.mechanic}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-4 text-white">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-neutral-700 rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    {page} / {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-neutral-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Filter Modal */}
            {filterOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] z-50 bg-neutral-800/20">
                    <div className="flex items-start w-full max-w-3xl mx-auto">
                        <div className="bg-neutral-800/40 hover:bg-neutral-800/80 hover:ring-white rounded-md p-10 shadow-lg space-x-5 text-neutral-300 flex-1 ring-neutral-400 ring-2">
                            <div className="flex space-x-4">
                                {/* Sort */}
                                <div className="flex flex-col ring-2 p-4 rounded-xl ring-neutral-500 hover:ring-neutral-400 flex-auto shadow-lg hover:shadow-blue-300/50">
                                    <p className="text-neutral-100">Sort</p>
                                    <div className="mt-1 pt-2 space-y-0.5 border-t-2 border-neutral-500 hover:border-neutral-400">
                                        {["alphabet", "price_asc", "price_desc"].map((s) => (
                                            <p
                                                key={s}
                                                className={`cursor-pointer ${selectedSort.includes(s) ? "text-purple-400 font-bold" : ""}`}
                                                onClick={() => toggleSort(s)}
                                            >
                                                {s.replace("_", " ").toUpperCase()}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* Filter */}
                                <div className="flex flex-col ring-2 p-4 rounded-xl ring-neutral-500 hover:ring-neutral-400 flex-auto shadow-lg hover:shadow-blue-300/50">
                                    <p className="text-neutral-100">Filter</p>
                                    <div className="mt-1 pt-2 space-y-2 border-t-2 border-neutral-500 hover:border-neutral-400">
                                        <p className="text-neutral-200">Category</p>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={categoryInput}
                                                onChange={(e) => setCategoryInput(e.target.value)}
                                                placeholder="Type category"
                                                className="flex-1 p-1 rounded bg-neutral-700 text-white outline-none"
                                            />
                                            <button
                                                onClick={addCategory}
                                                className="px-2 py-1 bg-blue-500 rounded text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedCategory.map((cat) => (
                                                <span
                                                    key={cat}
                                                    className="bg-blue-400 text-black px-2 py-1 rounded cursor-pointer"
                                                    onClick={() => removeCategory(cat)}
                                                >
                                                    {cat} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-neutral-200 mt-2">Mechanic</p>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={mechanicInput}
                                                onChange={(e) => setMechanicInput(e.target.value)}
                                                placeholder="Type mechanic"
                                                className="flex-1 p-1 rounded bg-neutral-700 text-white outline-none"
                                            />
                                            <button
                                                onClick={addMechanic}
                                                className="px-2 py-1 bg-blue-500 rounded text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedMechanic.map((mech) => (
                                                <span
                                                    key={mech}
                                                    className="bg-blue-400 text-black px-2 py-1 rounded cursor-pointer"
                                                    onClick={() => removeMechanic(mech)}
                                                >
                                                    {mech} ✕
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="ml-4 text-xl text-neutral-200 hover:text-red-400 cursor-pointer bg-neutral-800 p-1 rounded-lg"
                        >
                            <RxCross2 />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
