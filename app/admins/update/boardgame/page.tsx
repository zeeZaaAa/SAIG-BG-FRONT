"use client";

import BackButton from "@/components/element/back";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";
import { useRouter } from "next/navigation";


export default function UpdateBoardGame() {
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
    const gameId = params.get('boardgameId');

    const [loading, setLoading] = useState(false);

    const [id, setID] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [mechanic, setMechanic] = useState("");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");
    const [details, setDetails] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Load existing boardgame
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/board-games/search", {
                    params: { search: gameId }
                });

                const item = res.data.data[0];
                if (!item) return;

                setID(item._id);
                setName(item.name);
                setCategory(item.category);
                setMechanic(item.mechanic);
                setAmount(item.amount);
                setPrice(item.price);
                setDetails(item.description || "");
                setPreview(item.pic?.secure_url);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [gameId]);

    const submitdata = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("mechanic", mechanic);
        formData.append("amount", amount.toString());
        formData.append("price", price.toString());
        formData.append("description", details);

        if (file) formData.append("pic", file);

        try {
            const res = await api.patch(`/board-games/patch/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Updated successfully!");
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-900 ">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />

                <div className="text-neutral-300 flex-1 bg-neutral-800/30 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg">
                    <p className="font-bold text-xl">Update Board Game</p>

                    <form onSubmit={submitdata}>
                        <div className="mt-4">
                            <p>Upload photo:</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                        setFile(f);
                                        setPreview(URL.createObjectURL(f));
                                    }
                                }}
                            />
                        </div>

                        <div className="text-lg justify-center flex mt-4">
                            <Image
                                src={preview || "/SAIG-ICON.jpg"}
                                alt="Preview"
                                width={120}
                                height={120}
                                className="object-cover rounded-full"
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>id :</p>
                            <div className="flex-1 ">
                                <p>{id}</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="m-4 flex space-x-2">
                            <p>Name :</p>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        {/* Category */}
                        <div className="m-4 flex space-x-2">
                            <p>Category :</p>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                type="text"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        {/* Mechanic */}
                        <div className="m-4 flex space-x-2">
                            <p>Mechanic :</p>
                            <input
                                value={mechanic}
                                onChange={(e) => setMechanic(e.target.value)}
                                type="text"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        {/* Amount */}
                        <div className="m-4 flex space-x-2">
                            <p>Amount :</p>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        {/* Price */}
                        <div className="m-4 flex space-x-2">
                            <p>Price :</p>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        {/* Description */}
                        <div className="m-4 flex space-x-2">
                            <p>Description :</p>
                            <input
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                type="text"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-neutral-200/40 p-2 hover:bg-blue-500/60 rounded font-semibold disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "SAVE"}
                            </button>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    );
}
