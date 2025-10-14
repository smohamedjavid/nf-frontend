"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { User, PaginatedUsersResponse } from "@/types";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function UserPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: (): Promise<PaginatedUsersResponse> =>
      api.getUsers(currentPage, pageSize),
  });

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  const handleUserSelect = (user: User) => {
    router.push(`/user/${user.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">All Users</h1>
        </div>

        {/* All Users */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            All Users ({pagination ? pagination.total : users.length})
          </h2>
          {isLoading ? (
            <p className="text-gray-400">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400">No users found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-700 rounded p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    {user.isKOL && (
                      <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                        KOL
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-mono mb-2">
                    {user.id.slice(0, 12)}...
                  </p>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Referrals: {user._count.referrals}</span>
                    <span>Commissions: {user._count.commissions}</span>
                  </div>
                  {user.referralCode && (
                    <div className="mt-2">
                      <span className="text-blue-400 text-sm">
                        Code: {user.referralCode}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 transition-opacity"
              >
                <ChevronLeftIcon className="w-4 h-4 inline-block mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 transition-opacity"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
