"use client";

import BackButton from "@/components/element/back";
import Image from "next/image";
import { useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateBoardGame() {
    useAuth()

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

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

    const submitdata = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        console.log(formData)
        try {
            const res = await api.post("/board-games/create", formData );
            console.log("Result:", res.data);
            alert("Created successfully!");

        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen font-sans bg-neutral-900">
            <div className="flex items-start w-full max-w-3xl mx-auto pt-10 space-x-10">
                <BackButton />
                <div className="text-neutral-300 flex-1 bg-neutral-800/30 ring-2 ring-neutral-400 rounded-md p-4 shadow-lg">
                    <p className="font-bold text-xl">Create Board Game</p>

                    <form onSubmit={submitdata}>
                        <div className="mt-4">
                            <p>Upload photo:</p>
                            <input
                                type="file"
                                name="pic"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setPreview(URL.createObjectURL(file));
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
                            <p>Name :</p>
                            <input
                                name="name"
                                type="text"
                                placeholder="name"
                                className="flex-1 ring-1 ring-neutral-700"
                                required
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Category :</p>
                            <input
                                name="category"
                                type="text"
                                placeholder="category"
                                className="flex-1 ring-1 ring-neutral-700"
                                required
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Mechanic :</p>
                            <input
                                name="mechanic"
                                type="text"
                                placeholder="mechanic"
                                className="flex-1 ring-1 ring-neutral-700"
                                required
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Description :</p>
                            <input
                                name="description"
                                type="text"
                                placeholder="description"
                                className="flex-1 ring-1 ring-neutral-700"
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Amount :</p>
                            <input
                                name="amount"
                                type="number"
                                placeholder="amount"
                                className="flex-1 ring-1 ring-neutral-700"
                                required
                            />
                        </div>

                        <div className="m-4 flex space-x-2">
                            <p>Price :</p>
                            <input
                                name="price"
                                type="number"
                                placeholder="price"
                                className="flex-1 ring-1 ring-neutral-700"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-neutral-200/40 p-2 hover:bg-blue-500/60 rounded font-semibold disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "CREATE"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
