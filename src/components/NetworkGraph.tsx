"use client";

import { ReferralNetwork } from "@/types";

interface NetworkGraphProps {
  data: ReferralNetwork;
}

export function NetworkGraph({ data }: NetworkGraphProps) {
  const { rootUser, network, stats } = data;

  // Group users by level
  const level1Users = network.filter((u) => u.level === 1);
  const level2Users = network.filter((u) => u.level === 2);
  const level3Users = network.filter((u) => u.level === 3);

  return (
    <div className="space-y-4">
      {/* Network Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.level1Count}
          </div>
          <div className="text-sm text-gray-400">Level 1</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {stats.level2Count}
          </div>
          <div className="text-sm text-gray-400">Level 2</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {stats.level3Count}
          </div>
          <div className="text-sm text-gray-400">Level 3</div>
        </div>
      </div>

      {/* Network Tree */}
      <div className="bg-gray-900 rounded p-4 font-mono text-sm overflow-x-auto">
        <div className="space-y-2">
          {/* Root User */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400 font-bold">{rootUser.name}</span>
            {rootUser.isKOL && <span className="text-yellow-300">(KOL)</span>}
          </div>

          {/* Level 1 */}
          {level1Users.length > 0 && (
            <div className="ml-6 space-y-1">
              {level1Users.map((user, index) => (
                <div key={user.id} className="relative">
                  {index < level1Users.length - 1 && (
                    <div className="absolute left-0 top-3 w-px h-full bg-gray-600"></div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-400">{user.name}</span>
                    {user.isKOL && (
                      <span className="text-yellow-300">(KOL)</span>
                    )}
                    <span className="text-gray-500">
                      ({user._count.referrals} referrals)
                    </span>
                  </div>

                  {/* Level 2 for this user */}
                  {(() => {
                    const userLevel2 = level2Users.filter(
                      (u) => u.referrerId === user.id
                    );
                    return userLevel2.length > 0 ? (
                      <div className="ml-6 space-y-1">
                        {userLevel2.map((level2User, l2Index) => (
                          <div key={level2User.id} className="relative">
                            {l2Index < userLevel2.length - 1 && (
                              <div className="absolute left-0 top-3 w-px h-full bg-gray-600"></div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-green-400">
                                {level2User.name}
                              </span>
                              {level2User.isKOL && (
                                <span className="text-yellow-300">(KOL)</span>
                              )}
                              <span className="text-gray-500">
                                ({level2User._count.referrals} referrals)
                              </span>
                            </div>

                            {/* Level 3 for this user */}
                            {(() => {
                              const userLevel3 = level3Users.filter(
                                (u) => u.referrerId === level2User.id
                              );
                              return userLevel3.length > 0 ? (
                                <div className="ml-6 space-y-1">
                                  {userLevel3.map((level3User, l3Index) => (
                                    <div
                                      key={level3User.id}
                                      className="relative"
                                    >
                                      {l3Index < userLevel3.length - 1 && (
                                        <div className="absolute left-0 top-3 w-px h-full bg-gray-600"></div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span className="text-purple-400">
                                          {level3User.name}
                                        </span>
                                        {level3User.isKOL && (
                                          <span className="text-yellow-300">
                                            (KOL)
                                          </span>
                                        )}
                                        <span className="text-gray-500">
                                          ({level3User._count.referrals}{" "}
                                          referrals)
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null;
                            })()}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-400 text-center">
        Total Network Size: {stats.totalReferrals} users
      </div>
    </div>
  );
}
