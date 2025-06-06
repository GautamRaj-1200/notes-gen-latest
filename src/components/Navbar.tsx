import { appInfo } from "@/utils/constants";
import Image from "next/image";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
});

const Navbar = () => {
  return (
    <>
      <header>
        <nav className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 p-4 md:flex-row md:gap-0">
          <h1 className={`${dancingScript.className} text-4xl font-black`}>
            {appInfo.title}
          </h1>
          <div className="flex gap-8">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-[1000px] bg-gray-800 px-6 py-2 text-xl font-semibold transition-all duration-500 hover:bg-gray-100 hover:text-gray-700">
              <Image
                src={`/icons/google-color-icon.png`}
                alt="Google icon"
                width={20}
                height={20}
              />
              SignIn
            </button>
            <button className="relative cursor-pointer rounded-[1000px] bg-gray-900 px-4 py-2 font-semibold transition-colors duration-500 after:absolute after:-inset-0.5 after:-z-10 after:rounded-[1000px] after:bg-linear-to-r after:from-purple-500 after:to-pink-500 after:blur-lg after:transition-all after:duration-300 after:content-[''] hover:bg-gray-800 hover:after:blur-xl">
              {appInfo.getStarted}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
