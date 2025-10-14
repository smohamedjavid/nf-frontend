"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GenerateCodeRequest } from "@/types";
import { StatusMessage } from "./StatusMessage";

interface GenerateReferralCodeProps {
  userId: string;
  hasReferralCode: boolean;
}

export function GenerateReferralCode({
  userId,
  hasReferralCode,
}: GenerateReferralCodeProps) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: GenerateCodeRequest) => api.generateCode(data),
    onSuccess: (data) => {
      setStatus({
        type: "success",
        message: `Referral code generated: ${data.referralCode}`,
      });
      // Invalidate users query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (err: Error) => {
      setStatus({ type: "error", message: err.message });
    },
  });

  const handleGenerate = () => {
    setStatus(null);
    const request: GenerateCodeRequest = { userId };
    generateMutation.mutate(request);
  };

  if (hasReferralCode) {
    return null; // Don't show if user already has a code
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Generate Referral Code
      </h2>

      <p className="text-gray-300 mb-4">
        Generate a unique referral code for this user to start earning
        commissions from their referrals.
      </p>

      <button
        onClick={handleGenerate}
        disabled={generateMutation.isPending}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
      >
        {generateMutation.isPending
          ? "Generating..."
          : "Generate Referral Code"}
      </button>

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
