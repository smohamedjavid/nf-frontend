"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { NetworkGraph } from "@/components/NetworkGraph";
import { EarningsChart } from "@/components/EarningsChart";
import { ClaimEarnings } from "@/components/ClaimEarnings";
import { GenerateReferralCode } from "@/components/GenerateReferralCode";
import { CommissionProfileManager } from "@/components/CommissionProfileManager";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.getUser(userId),
    enabled: !!userId,
  });

  const { data: networkData, isLoading: networkLoading } = useQuery({
    queryKey: ["referral-network", userId],
    queryFn: () => api.getReferralNetwork(userId),
    enabled: !!userId,
  });

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ["earnings", userId],
    queryFn: () => api.getEarnings(userId),
    enabled: !!userId,
  });

  const user = userData;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-800 rounded"></div>
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              User Not Found
            </h1>
            <p className="text-gray-400">
              The requested user could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400 font-mono text-sm">{user.id}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {user.isKOL && (
              <span className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded text-sm font-medium">
                KOL
              </span>
            )}
            {user.referralCode && (
              <button
                onClick={() =>
                  navigator.clipboard.writeText(user.referralCode!)
                }
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                Copy Code: {user.referralCode}
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">
              Total Referrals
            </h3>
            <p className="text-2xl font-bold text-white">
              {user._count.referrals}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">
              Total Commissions
            </h3>
            <p className="text-2xl font-bold text-white">
              {user._count.commissions}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">
              Total Earnings
            </h3>
            <p className="text-2xl font-bold text-green-400">
              {earningsData?.summary.totalEarnings || "0"} XP
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">
              Unclaimed Earnings
            </h3>
            <p className="text-2xl font-bold text-yellow-400">
              {earningsData?.summary.totalUnclaimed || "0"} XP
            </p>
          </div>
        </div>

        {/* Generate Referral Code */}
        <div className="mb-8">
          <GenerateReferralCode
            userId={userId}
            hasReferralCode={!!user.referralCode}
          />
        </div>

        {/* Commission Profile Manager */}
        <div className="mb-8">
          <CommissionProfileManager user={user} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Network Graph */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Referral Network</h2>
            {networkLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            ) : networkData ? (
              <NetworkGraph data={networkData} />
            ) : (
              <p className="text-gray-400">Failed to load network data</p>
            )}
          </div>

          {/* Earnings Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
            {earningsLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            ) : earningsData ? (
              <EarningsChart data={earningsData} />
            ) : (
              <p className="text-gray-400">Failed to load earnings data</p>
            )}
          </div>
        </div>

        {/* Claim Earnings */}
        <div className="mt-8">
          <ClaimEarnings userId={userId} earningsData={earningsData} />
        </div>

        {/* Detailed Earnings Table */}
        {earningsData && earningsData.earnings.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Earnings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-gray-400">
                      Referred User
                    </th>
                    <th className="text-left py-2 px-4 text-gray-400">Level</th>
                    <th className="text-right py-2 px-4 text-gray-400">
                      Total
                    </th>
                    <th className="text-right py-2 px-4 text-gray-400">
                      Claimed
                    </th>
                    <th className="text-right py-2 px-4 text-gray-400">
                      Unclaimed
                    </th>
                    <th className="text-right py-2 px-4 text-gray-400">
                      Commissions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.earnings.map((earning, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 px-4 text-white">
                        {earning.referredUser.name}
                      </td>
                      <td className="py-2 px-4 text-gray-300">
                        {earning.level}
                      </td>
                      <td className="py-2 px-4 text-right text-green-400">
                        {earning.total} XP
                      </td>
                      <td className="py-2 px-4 text-right text-blue-400">
                        {earning.claimed} XP
                      </td>
                      <td className="py-2 px-4 text-right text-yellow-400">
                        {earning.unclaimed} XP
                      </td>
                      <td className="py-2 px-4 text-right text-gray-300">
                        {earning.totalCommissions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
