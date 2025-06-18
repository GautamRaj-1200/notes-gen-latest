import { appInfo } from "@/utils/constants";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center p-8">
      <section className="mt-16 max-w-4xl text-center">
        <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl">
          Unlock Insights from Your Documents
        </h1>
        <p className="mt-6 text-lg text-gray-300 md:text-xl">
          Automatically generate concise, intelligent notes from your PDF
          documents. Save time, study smarter, and focus on what truly matters.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/user/create-notes"
            className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-900 transition-transform duration-300 hover:scale-105"
          >
            <span>{appInfo.getStarted}</span>
            <MoveRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="mt-24 w-full max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white">
          How It Works
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3 text-purple-400">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Upload</h3>
            <p className="text-gray-400">
              Securely upload your PDF document. Your files are kept private and
              confidential.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <div className="mb-4 inline-block rounded-full bg-pink-500/20 p-3 text-pink-400">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Analyze</h3>
            <p className="text-gray-400">
              Our AI, powered by Gemini, reads and understands your
              document&apos;s content in moments.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <div className="mb-4 inline-block rounded-full bg-green-500/20 p-3 text-green-400">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Generate</h3>
            <p className="text-gray-400">
              Receive well-structured, easy-to-digest notes, summaries, and key
              takeaways.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
