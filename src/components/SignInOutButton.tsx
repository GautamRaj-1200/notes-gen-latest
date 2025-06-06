"use client";
import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const SignInOutButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-3">
        <p className="flex items-center gap-2">
          <span className="text-lg font-semibold">{session.user.name} </span>
          <Image
            src={session.user.image ?? ""}
            alt={session.user.image ?? ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        </p>
        <button
          onClick={() => signOut()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-[1000px] bg-gray-800 px-6 py-2 text-xl font-semibold transition-all duration-500 hover:bg-gray-100 hover:text-gray-700"
        >
          SignOut
        </button>
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
