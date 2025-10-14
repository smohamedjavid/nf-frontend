"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RegisterUserRequest } from "@/types";
import { StatusMessage } from "./StatusMessage";

export function AddUser() {
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: api.registerUser,
    onSuccess: (data) => {
      setStatus({
        type: "success",
        message: `User registered successfully! User ID: ${data.userId}`,
      });
      setName("");
      setReferralCode("");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (err: Error) => {
      setStatus({ type: "error", message: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatus({ type: "error", message: "Name is required" });
      return;
    }

    const request: RegisterUserRequest = {
      name: trimmedName,
      ...(referralCode.trim() && { referralCode: referralCode.trim() }),
    };

    registerMutation.mutate(request);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Register New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter user name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Referral Code (optional)
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter referral code if you have one"
          />
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
        >
          {registerMutation.isPending ? "Registering..." : "Register User"}
        </button>
      </form>

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
