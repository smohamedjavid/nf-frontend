"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Earnings, ClaimRequest } from "@/types";
import { StatusMessage } from "./StatusMessage";

interface ClaimEarningsProps {
  userId: string;
  earningsData?: Earnings;
}

export function ClaimEarnings({ userId, earningsData }: ClaimEarningsProps) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: api.claimEarnings,
    onSuccess: (data) => {
      const message = data.commissionId
        ? `Successfully claimed ${data.claimed} XP from commission!`
        : `Successfully claimed ${data.claimed} XP from ${data.commissionsClaimed} commissions!`;
      setStatus({ type: "success", message });
      // Invalidate earnings queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["earnings", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (err: Error) => {
      setStatus({ type: "error", message: err.message });
    },
  });

  const availableAmount = parseFloat(
    earningsData?.summary.totalUnclaimed || "0"
  );

  const handleClaimCommission = (commissionId: string) => {
    setStatus(null);
    const request: ClaimRequest = {
      userId,
      claimId: commissionId,
      token: "XP",
    };
    claimMutation.mutate(request);
  };

  const handleClaimAll = () => {
    setStatus(null);
    const request: ClaimRequest = {
      userId,
      claimAll: true,
      token: "XP",
    };
    claimMutation.mutate(request);
  };

  // Get all unclaimed commissions
  const unclaimedCommissions =
    earningsData?.earnings
      .flatMap((earning) => earning.commissions)
      .filter((commission) => !commission.claimed) || [];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Claim Earnings</h2>

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Available to Claim:</span>
          <span className="text-yellow-400 font-bold text-lg">
            {availableAmount.toFixed(2)} XP
          </span>
        </div>
      </div>

      {availableAmount > 0 ? (
        <div className="space-y-4">
          {/* Individual Commissions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                Individual Commissions
              </h3>
              <button
                onClick={handleClaimAll}
                disabled={claimMutation.isPending}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
              >
                {claimMutation.isPending
                  ? "Processing..."
                  : "Claim All Earnings"}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {unclaimedCommissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600"
                >
                  <div>
                    <div className="text-white font-medium">
                      {parseFloat(commission.amount).toFixed(2)} XP
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaimCommission(commission.id)}
                    disabled={claimMutation.isPending}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                  >
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400">No earnings available to claim</p>
        </div>
      )}

      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          className="mt-4"
        />
      )}
    </div>
  );
}
