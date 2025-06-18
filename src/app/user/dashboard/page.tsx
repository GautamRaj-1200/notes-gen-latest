"use client";

import { useState, useEffect } from "react";

interface CreditHistory {
  id: string;
  createdAt: string;
  details: string;
  creditsUsed: number;
}

interface DashboardData {
  credits: number;
  history: CreditHistory[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Dashboard</h1>

      <div className="mb-12 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-semibold text-gray-300">
          Available Credits
        </h2>
        <p className="text-5xl font-extrabold text-white">
          {data?.credits ?? 0}
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">
          Credit Usage History
        </h2>
        <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Details
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Credits Used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data?.history && data.history.length > 0 ? (
                data.history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                      {item.details}
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-red-400">
                      -{item.creditsUsed}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No credit history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
