"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types";
import Link from "next/link";

interface UserListProps {
  onUserSelect?: (user: User) => void;
}

export function UserList({ onUserSelect }: UserListProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => api.getUsers(1, 50), // Get more users for the list
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
        <div className="text-red-400 mb-4">
          Failed to load users: {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const users = data?.data || [];

  // TODO: Move it to backend API
  // Sort by creation date (newest first) and limit to 20 for main page
  const displayUsers = users
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 20);

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">
          Recent Users ({displayUsers.length})
        </h2>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>

      {displayUsers.length === 0 ? (
        <p className="text-gray-400 flex-1">No users found.</p>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-700 rounded p-3 hover:bg-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    {user.isKOL && (
                      <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                        KOL
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-mono">
                    {user.id.slice(0, 8)}...
                  </p>
                  <div className="flex gap-4 mt-1 text-sm text-gray-300">
                    <span>Referrals: {user._count.referrals}</span>
                    <span>Commissions: {user._count.commissions}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onUserSelect && (
                    <button
                      onClick={() => onUserSelect(user)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                      Select
                    </button>
                  )}
                  <Link
                    href={`/user/${user.id}`}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              {user.referralCode && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode!);
                      alert("Copied to clipboard");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-mono text-sm underline"
                    title="Click to copy referral code"
                  >
                    Code: {user.referralCode}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
