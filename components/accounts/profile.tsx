"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa6";
import { GrFormCheckmark } from "react-icons/gr";
import api from "@/api/api";
import { useAuth } from "@/guard/require_login";

export default function ProfileConfig() {
    useAuth()

    const [email, setEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [picUrl, setPicUrl] = useState<string>("/SAIG-ICON.jpg");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newUserName, setNewUserName] = useState<string>("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/me");
                const user = res.data;
                setEmail(user.email);
                setUserName(user.userName);
                setNewUserName(user.userName);
                setPicUrl(user.pic?.secure_url || "/SAIG-ICON.jpg");
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userName", newUserName);

        const fileInput = document.getElementById("profileFile") as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formData.append("file", fileInput.files[0]);
        }

        try {
            const res = await api.post("/users/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedUser = res.data;
            setUserName(updatedUser.userName);
            setPicUrl(updatedUser.pic?.secure_url || "/SAIG-ICON.jpg");
            setIsEdit(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    return (
        <div className="text-md flex-col px-4 flex-1">
            <p className="text-xl flex justify-center">PROFILE</p>
            <div className="pt-4 flex justify-center">
                <div className="w-32 h-32 relative rounded-full ring-3 ring-blue-400 overflow-hidden">
                    <Image
                        src={picUrl}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <form onSubmit={handleSave} className="mt-4">
                <p>email : {email}</p>
                <div className="flex space-x-2 items-center">
                    {!isEdit ? (
                        <p>user name : {userName}</p>
                    ) : (
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Enter user name"
                            className="bg-neutral-800 placeholder:text-neutral-300 outline-none rounded-lg p-1"
                        />
                    )}

                    <div
                        className="bg-neutral-800 p-1.5 rounded-lg cursor-pointer"
                        onClick={() => {
                            if (isEdit) handleSave(new Event("submit") as any);
                            setIsEdit(!isEdit);
                        }}
                    >
                        {isEdit ? (
                            <div className="hover:text-green-500">
                                <GrFormCheckmark />
                            </div>
                        ) : (
                            <div className="hover:text-yellow-500">
                                <FaPen />
                            </div>
                        )}
                    </div>
                </div>

                {isEdit && (
                    <div className="mt-2">
                        <input type="file" id="profileFile" accept="image/*" />
                    </div>
                )}
            </form>
        </div>
    );
}
