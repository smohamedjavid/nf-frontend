"use client";

import { Earnings } from "@/types";

interface EarningsChartProps {
  data: Earnings;
}

export function EarningsChart({ data }: EarningsChartProps) {
  const { summary, earnings } = data;

  // Calculate earnings by level and cashback
  const levelEarnings = earnings.reduce((acc, earning) => {
    const level = earning.level;
    if (!acc[level]) {
      acc[level] = { total: 0, claimed: 0, unclaimed: 0, count: 0 };
    }
    acc[level].total += parseFloat(earning.total);
    acc[level].claimed += parseFloat(earning.claimed);
    acc[level].unclaimed += parseFloat(earning.unclaimed);
    acc[level].count += 1;
    return acc;
  }, {} as Record<number, { total: number; claimed: number; unclaimed: number; count: number }>);

  // Separate cashback from referral earnings
  const cashbackEarnings = levelEarnings[0] || {
    total: 0,
    claimed: 0,
    unclaimed: 0,
    count: 0,
  };
  const referralEarnings: Record<
    number,
    { total: number; claimed: number; unclaimed: number; count: number }
  > = {
    1: levelEarnings[1],
    2: levelEarnings[2],
    3: levelEarnings[3],
  };

  const maxEarnings = Math.max(
    ...Object.values(levelEarnings).map((l) => l.total)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Total Earnings</div>
          <div className="text-xl font-bold text-green-400">
            {summary.totalEarnings} XP
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Available to Claim</div>
          <div className="text-xl font-bold text-yellow-400">
            {summary.totalUnclaimed} XP
          </div>
        </div>
      </div>

      {/* Overall Level Distribution */}
      <div>
        <h3 className="text-lg font-medium mb-3">Overall Level Distribution</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Earnings Distribution</span>
            <span className="text-white">
              {Object.values(levelEarnings)
                .reduce((sum, level) => sum + level.total, 0)
                .toFixed(2)}{" "}
              XP Total
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 flex overflow-hidden">
            {/* Cashback segment */}
            {cashbackEarnings.total > 0 && (
              <div
                className="h-4 bg-orange-500"
                style={{
                  width: `${
                    (cashbackEarnings.total /
                      Object.values(levelEarnings).reduce(
                        (sum, level) => sum + level.total,
                        0
                      )) *
                    100
                  }%`,
                }}
                title={`Cashback: ${(
                  (cashbackEarnings.total /
                    Object.values(levelEarnings).reduce(
                      (sum, level) => sum + level.total,
                      0
                    )) *
                  100
                ).toFixed(1)}%`}
              />
            )}
            {/* Referral level segments */}
            {[1, 2, 3].map((level) => {
              const levelData = referralEarnings[level];
              if (!levelData) return null;

              const totalEarnings = Object.values(levelEarnings).reduce(
                (sum, level) => sum + level.total,
                0
              );
              const percentage =
                totalEarnings > 0 ? (levelData.total / totalEarnings) * 100 : 0;

              return (
                <div
                  key={level}
                  className={`h-4 ${
                    level === 1
                      ? "bg-blue-500"
                      : level === 2
                      ? "bg-green-500"
                      : "bg-purple-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                  title={`Level ${level}: ${percentage.toFixed(1)}%`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            {cashbackEarnings.total > 0 && (
              <span className="text-orange-400">
                Cashback:{" "}
                {(
                  (cashbackEarnings.total /
                    Object.values(levelEarnings).reduce(
                      (sum, level) => sum + level.total,
                      0
                    )) *
                  100
                ).toFixed(1)}
                %
              </span>
            )}
            {[1, 2, 3].map((level) => {
              const levelData = referralEarnings[level];
              if (!levelData) return null;

              const totalEarnings = Object.values(levelEarnings).reduce(
                (sum, level) => sum + level.total,
                0
              );
              const percentage =
                totalEarnings > 0 ? (levelData.total / totalEarnings) * 100 : 0;

              return (
                <span
                  key={level}
                  className={
                    level === 1
                      ? "text-blue-400"
                      : level === 2
                      ? "text-green-400"
                      : "text-purple-400"
                  }
                >
                  Level {level}: {percentage.toFixed(1)}%
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cashback Earnings */}
      {cashbackEarnings.total > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Cashback Earnings</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Trading Cashback</span>
              <span className="text-orange-400 font-bold">
                {cashbackEarnings.total.toFixed(2)} XP
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
              <div
                className="h-3 bg-green-600"
                style={{
                  width: `${
                    cashbackEarnings.total > 0
                      ? (cashbackEarnings.claimed / cashbackEarnings.total) *
                        100
                      : 0
                  }%`,
                }}
                title={`Claimed: ${(
                  (cashbackEarnings.claimed / cashbackEarnings.total) *
                  100
                ).toFixed(1)}%`}
              />
              <div
                className="h-3 bg-yellow-600"
                style={{
                  width: `${
                    cashbackEarnings.total > 0
                      ? (cashbackEarnings.unclaimed / cashbackEarnings.total) *
                        100
                      : 0
                  }%`,
                }}
                title={`Unclaimed: ${(
                  (cashbackEarnings.unclaimed / cashbackEarnings.total) *
                  100
                ).toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span className="text-green-400">
                Claimed: {cashbackEarnings.claimed.toFixed(2)} XP (
                {(
                  (cashbackEarnings.claimed / cashbackEarnings.total) *
                  100
                ).toFixed(1)}
                %)
              </span>
              <span className="text-yellow-400">
                Unclaimed: {cashbackEarnings.unclaimed.toFixed(2)} XP (
                {(
                  (cashbackEarnings.unclaimed / cashbackEarnings.total) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Referral Level Breakdown */}
      <div>
        <h3 className="text-lg font-medium mb-3">Referral Level Breakdown</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((level) => {
            const levelData = referralEarnings[level];
            if (!levelData) return null;

            const totalForLevel = levelData.total;
            const claimedPercentage =
              totalForLevel > 0 ? (levelData.claimed / totalForLevel) * 100 : 0;
            const unclaimedPercentage =
              totalForLevel > 0
                ? (levelData.unclaimed / totalForLevel) * 100
                : 0;

            return (
              <div key={level} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Level {level}</span>
                  <span className="text-white">
                    {levelData.total.toFixed(2)} XP ({levelData.count} users)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
                  <div
                    className="h-3 bg-green-600"
                    style={{ width: `${claimedPercentage}%` }}
                    title={`Claimed: ${claimedPercentage.toFixed(1)}%`}
                  />
                  <div
                    className="h-3 bg-yellow-600"
                    style={{ width: `${unclaimedPercentage}%` }}
                    title={`Unclaimed: ${unclaimedPercentage.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="text-green-400">
                    Claimed: {levelData.claimed.toFixed(2)} XP (
                    {claimedPercentage.toFixed(1)}%)
                  </span>
                  <span className="text-yellow-400">
                    Unclaimed: {levelData.unclaimed.toFixed(2)} XP (
                    {unclaimedPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Commissions */}
      {earnings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Recent Commissions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {earnings
              .flatMap((earning) =>
                earning.commissions.map((commission) => ({
                  ...commission,
                  referredUser: earning.referredUser.name,
                  level: earning.level,
                }))
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 10)
              .map((commission, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700 rounded p-2 text-sm"
                >
                  <div>
                    <span className="text-gray-300">
                      {commission.referredUser}
                    </span>
                    <span className="text-gray-500 ml-2">
                      (Level {commission.level})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        commission.claimed
                          ? "bg-green-800 text-green-200"
                          : "bg-yellow-800 text-yellow-200"
                      }`}
                    >
                      {commission.claimed ? "Claimed" : "Unclaimed"}
                    </span>
                    <span className="text-green-400 font-medium">
                      {commission.amount} XP
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
