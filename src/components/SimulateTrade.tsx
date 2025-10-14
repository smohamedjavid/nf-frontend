"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TradeRequest } from "@/types";
import { StatusMessage } from "./StatusMessage";

export function SimulateTrade() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fee, setFee] = useState("");
  const [volume, setVolume] = useState("");
  const [tradeType, setTradeType] = useState("spot");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(1, 100),
  });

  const users = usersData?.data || [];

  const tradeMutation = useMutation({
    mutationFn: api.simulateTrade,
    onSuccess: (data) => {
      setStatus({
        type: "success",
        message: `Trade simulated successfully! Webhook ID: ${data.webhookId}`,
      });
      setFee("");
      setVolume("");
      setSelectedUserId("");
    },
    onError: (err: Error) => {
      setStatus({ type: "error", message: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!selectedUserId) {
      setStatus({ type: "error", message: "Please select a user" });
      return;
    }

    const volumeAmount = parseFloat(volume);
    if (!volume || volumeAmount <= 0) {
      setStatus({
        type: "error",
        message: "Please enter a valid volume amount",
      });
      return;
    }

    const feeAmount = parseFloat(fee);
    if (!fee || feeAmount <= 0) {
      setStatus({ type: "error", message: "Please enter a valid fee amount" });
      return;
    }

    const request: TradeRequest = {
      userId: selectedUserId,
      volume: volumeAmount,
      fee: feeAmount,
      tradeType,
    };

    tradeMutation.mutate(request);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status?.type === "success" || status?.type === "error") {
      timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [status]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Simulate Trade</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select User *
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.id.slice(0, 8)}...)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Trade Volume *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter trade volume amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Trade Fee *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter trade fee amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Trade Type
          </label>
          <select
            value={tradeType}
            onChange={(e) => setTradeType(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="spot">Spot Trading</option>
            <option value="futures">Futures Trading</option>
            <option value="options">Options Trading</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={tradeMutation.isPending}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
        >
          {tradeMutation.isPending ? "Processing Trade..." : "Simulate Trade"}
        </button>
      </form>

      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          className="mt-4"
        />
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>
          Note: Trades are processed asynchronously. Commissions will be
          distributed to the referral network.
        </p>
      </div>
    </div>
  );
}
