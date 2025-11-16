"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/api/api";

export default function TableConf() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [deleteMode, setDeleteMode] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    // โหลดข้อมูล
    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tables/search", {
                params: {
                    search: search || undefined,
                    page: page,
                    page_size: 5,
                },
                withCredentials: true,
            });

            setTables(res.data.data);
            setTotalPages(res.data.totalPages ?? 1);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, [page]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchTables();
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    // toggle delete mode
    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        setSelected([]);
    };

    // เลือก checkbox
    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ลบรายการที่เลือกทั้งหมด
    const deleteSelected = async () => {
        if (selected.length === 0) return;
        if (!confirm(`Do you want to delete ${selected.length} items?`)) return;

        try {
            for (const id of selected) {
                await api.delete(`/tables/delete/${id}`);
            }
            alert("Deleted");
            setSelected([]);
            fetchTables();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Delete error");
        }
    };

    return (
        <div className="flex-1 ml-2">
            {/* Header */}
            <div className="flex justify-between bg-neutral-800/10 space-x-2">
                <div className="flex-none mr-4 mt-2 font-bold text-xl text-green-400">
                    <p>TABLE</p>
                </div>

                <div className="flex-1 flex ml-2">
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none ring-green-400 ring-2 p-2 px-4 rounded-full flex-1"
                    />
                </div>

                <div className="mx-4 my-2 flex space-x-3 flex-none">
                    <Link href="/admins/create/table">
                        <div className="hover:bg-green-400 rounded-full p-1">
                            <FaPlus />
                        </div>
                    </Link>

                    <div
                        className={`p-1 rounded-full cursor-pointer ${deleteMode ? "bg-red-500" : "hover:bg-red-400"
                            }`}
                        onClick={toggleDeleteMode}
                    >
                        <FaMinus />
                    </div>
                </div>
            </div>

            {/* Delete button */}
            {deleteMode && selected.length > 0 && (
                <div
                    className="mt-4 bg-red-600 text-white p-2 rounded-md cursor-pointer w-40 text-center"
                    onClick={deleteSelected}
                >
                    Delete Selected
                </div>
            )}

            {/* Content */}
            <div className="mt-5 text-neutral-200">
                {loading && <p>Loading...</p>}

                {!loading && tables.length === 0 && <p>No tables found</p>}

                {!loading && tables.length > 0 && (
                    <div className="space-y-3">
                        {tables.map((t) => (
                            <div
                                key={t._id}
                                className="bg-neutral-800/40 p-3 rounded-lg ring-1 ring-neutral-700 flex items-start space-x-3 cursor-pointer"
                            >
                                {deleteMode && (
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(t._id)}
                                        onChange={() => handleSelect(t._id)}
                                        className="mt-1"
                                    />
                                )}

                                <div
                                    onClick={() =>
                                        router.push(`/admins/update/table?tableId=${t._id}`)
                                    }
                                >
                                    <p className="text-lg font-bold text-green-300">
                                        Table #{t.number}
                                    </p>

                                    <div className="text-sm text-neutral-400">
                                        <p>Room: {t.room?.number || t.room}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-6 text-neutral-300">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-4 py-2 rounded-md ${page <= 1
                            ? "bg-neutral-700"
                            : "bg-neutral-600 hover:bg-neutral-500"
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
                    className={`px-4 py-2 rounded-md ${page >= totalPages
                            ? "bg-neutral-700"
                            : "bg-neutral-600 hover:bg-neutral-500"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
