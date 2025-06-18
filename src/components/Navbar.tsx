import { appInfo } from "@/utils/constants";
import { Dancing_Script } from "next/font/google";
import SignInOutButton from "./SignInOutButton";
import Link from "next/link";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
});

const Navbar = () => {
  return (
    <>
      <header>
        <nav className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 p-4 md:flex-row md:gap-0">
          <Link href="/">
            <h1 className={`${dancingScript.className} text-4xl font-black`}>
              {appInfo.title}
            </h1>
          </Link>
          <div className="flex items-center gap-8">
            <SignInOutButton />
            <Link
              href="/user/create-notes"
              className="relative cursor-pointer rounded-[1000px] bg-gray-900 px-4 py-2 font-semibold transition-colors duration-500 after:absolute after:-inset-0.5 after:-z-10 after:rounded-[1000px] after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:blur-lg after:transition-all after:duration-300 after:content-[''] hover:bg-gray-800 hover:after:blur-xl"
            >
              {appInfo.getStarted}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
