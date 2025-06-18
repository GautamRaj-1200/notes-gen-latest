"use client";
import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const SignInOutButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-1">
        <p className="flex items-center gap-2">
          {/* <span className="rounded-md bg-gray-800 px-2 py-1 text-lg">
            5 credits
          </span> */}
          <span className="text-lg font-semibold">{session.user.name} </span>
          <Image
            src={session.user.image ?? ""}
            alt={session.user.image ?? ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <Link href="/user/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              <span>Credits</span> <span>{session.user.credits}</span>{" "}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => signOut()}>SignOut</button>{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <button
          onClick={() => signOut()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-[1000px] bg-gray-800 px-6 py-2 text-xl font-semibold transition-all duration-500 hover:bg-gray-100 hover:text-gray-700"
        >
          SignOut
        </button> */}
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn()}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-[1000px] bg-gray-800 px-6 py-2 text-xl font-semibold transition-all duration-500 hover:bg-gray-100 hover:text-gray-700"
    >
      <Image
        src={`/icons/google-color-icon.png`}
        alt="Google icon"
        width={20}
        height={20}
      />
      SignIn
    </button>
  );
};

export default SignInOutButton;
