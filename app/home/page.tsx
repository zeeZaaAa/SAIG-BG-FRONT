"use client";

import Nav from "@/components/users/nav";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";
import { TbCircleArrowRightFilled} from "react-icons/tb";
import Image from "next/image";
import { useAuth } from "@/guard/require_login";

export default function Home() {
  useAuth();

  return (
    <>
      <div className="min-h-screen font-sans bg-neutral-900 bg-size-[100px_100px] bg-[linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]">

        <div className="bg-blue-100/80 backdrop-blur-[2px] shadow-xl hover:shadow-blue-100/30 hover:bg-blue-100 transition-all rounded-2xl mx-10 fixed top-6 left-0 right-0 hover:ring-2 hover:ring-blue-200">
          <Nav />
        </div>

        <div className="flex text-neutral-200 px-30 py-33 pb-20 flex-col ring-2 ring-neutral-300 justify-between min-h-screen">
          <div>
            <h1 className="text-6xl font-bold">
              Booking Board Game Application!!
            </h1>
            <div className="mt-8 text-lg text-neutral-300 ml-10">
              <p className="wrap-break-words leading-relaxed">
                Welcome to SAIG Board Game, your ultimate destination for
                booking and enjoying a wide variety of board games. Whether you're
                a casual player or a dedicated enthusiast, our platform offers an
                easy and convenient way to explore, reserve, and play your
                favorite board games with friends and family.
              </p>
            </div>
          </div>
          <div className="flex items-start w-full max-w-5xl mx-auto pt-10 space-x-20">
            <div>
              <Image
                src="/chess.avif"
                alt="Picture of the SAIG"
                width={500}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <Link href="/home/view-all-boardgame" className="flex my-auto group">
              <div className="flex bg-purple-500 shadow-2xl shadow-white/50 hover:shadow-lg text-neutral-900 py-8 px-20 rounded-lg text-2xl flex-1 space-x-2 transition-all">
                <p className="hover:text-neutral-900">BOOK NOW!</p>
                <div className="my-auto group-hover:text-green-500 transition-colors">
                  <TbCircleArrowRightFilled />
                </div>
              </div>
            </Link>
          </div>
          <div className="mx-auto mt-4">
            <p>see what game do we have</p>
            <div className="flex justify-center items-center mt-2 animate-bounce">
              <FaArrowDown />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center bg-blue-100/50 text-neutral-800 p-2 rounded-lg fixed bottom-0 left-0 right-0 font-bold backdrop-blur-[2px]">
            <p>© 2025 SAIG Board Game. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>

  );
}