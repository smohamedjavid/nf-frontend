"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types";

interface CommissionProfileManagerProps {
  user: User;
}

interface CommissionProfileData {
  userId: string;
  name: string;
  commissionProfile: {
    isKOL: boolean;
    hasWaivedFees: boolean;
    customRates?: {
      level1: number | null;
      level2: number | null;
      level3: number | null;
    };
  };
}

interface CustomRates {
  level1: string;
  level2: string;
  level3: string;
}

const LEVELS = [1, 2, 3] as const;
const DEFAULT_PLACEHOLDERS = ["0.30", "0.03", "0.02"];

export function CommissionProfileManager({
  user,
}: CommissionProfileManagerProps) {
  const [isKOL, setIsKOL] = useState(user.isKOL || false);
  const [hasWaivedFees, setHasWaivedFees] = useState(
    user.hasWaivedFees || false
  );
  const [customRates, setCustomRates] = useState<CustomRates>({
    level1: "",
    level2: "",
    level3: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch current commission profile
  const { data: profileData, isLoading: profileLoading } =
    useQuery<CommissionProfileData>({
      queryKey: ["commission-profile", user.id],
      queryFn: () => api.getUserCommissionProfile(user.id),
    });

  // Update state when profile data loads
  useEffect(() => {
    if (profileData) {
      setIsKOL(profileData.commissionProfile.isKOL);
      setHasWaivedFees(profileData.commissionProfile.hasWaivedFees);
      if (profileData.commissionProfile.customRates) {
        setCustomRates({
          level1:
            profileData.commissionProfile.customRates.level1?.toString() || "",
          level2:
            profileData.commissionProfile.customRates.level2?.toString() || "",
          level3:
            profileData.commissionProfile.customRates.level3?.toString() || "",
        });
      }
    }
  }, [profileData]);

  // Update commission profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateUserCommissionProfile(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commission-profile", user.id],
      });
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSuccess("Commission profile updated successfully!");
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: Error) => {
      setError(`Failed to update commission profile: ${error.message}`);
      setSuccess(null);
    },
  });

  const validateCustomRate = (value: string): boolean => {
    if (!value) return true; // Empty is valid
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate custom rates
    const invalidRates = Object.entries(customRates).filter(
      ([, value]) => value && !validateCustomRate(value)
    );

    if (invalidRates.length > 0) {
      setError("Custom rates must be between 0 and 1");
      return;
    }

    const updateData: any = {
      isKOL,
      hasWaivedFees,
    };

    // Build custom rates object
    const rates: Record<string, number> = {};
    Object.entries(customRates).forEach(([level, value]) => {
      if (value) {
        rates[level] = parseFloat(value);
      }
    });

    if (Object.keys(rates).length > 0) {
      updateData.customRates = rates;
    } else if (profileData?.commissionProfile.customRates) {
      // Clear custom rates if all fields are empty
      updateData.customRates = null;
    }

    updateMutation.mutate(updateData);
  };

  const handleRateChange = (level: keyof CustomRates, value: string) => {
    setCustomRates((prev) => ({
      ...prev,
      [level]: value,
    }));
  };

  if (profileLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Commission Profile for {user.name}
      </h3>

      {(error || success) && (
        <div
          className={`mb-4 p-3 rounded ${
            error
              ? "bg-red-900/50 border border-red-700 text-red-200"
              : "bg-green-900/50 border border-green-700 text-green-200"
          }`}
        >
          {error || success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* KOL Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`kol-${user.id}`}
            checked={isKOL}
            onChange={(e) => {
              const newIsKOL = e.target.checked;
              setIsKOL(newIsKOL);
              // Clear custom rates if user is no longer KOL
              if (!newIsKOL) {
                setCustomRates({
                  level1: "",
                  level2: "",
                  level3: "",
                });
              }
            }}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor={`kol-${user.id}`} className="text-sm text-gray-300">
            Key Opinion Leader (KOL) - 50% direct commission only
          </label>
        </div>

        {/* Waived Fees */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`waived-${user.id}`}
            checked={hasWaivedFees}
            onChange={(e) => setHasWaivedFees(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor={`waived-${user.id}`}
            className="text-sm text-gray-300"
          >
            Waived Fees - No commissions distributed
          </label>
        </div>

        {/* Custom Rates - Only show for KOL users */}
        {isKOL && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Custom Commission Rates (optional)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Set custom rates for each referral level (0.0 to 1.0, e.g., 0.3 =
              30%)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((level, index) => (
                <div key={level}>
                  <label className="block text-xs text-gray-400 mb-1">
                    Level {level}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={customRates[`level${level}` as keyof CustomRates]}
                    onChange={(e) =>
                      handleRateChange(
                        `level${level}` as keyof CustomRates,
                        e.target.value
                      )
                    }
                    placeholder={DEFAULT_PLACEHOLDERS[index]}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
        >
          {updateMutation.isPending
            ? "Updating..."
            : "Update Commission Profile"}
        </button>
      </form>

      {/* Current Profile Info */}
      {profileData && (
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Current Profile:
          </h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>KOL: {profileData.commissionProfile.isKOL ? "Yes" : "No"}</div>
            <div>
              Waived Fees:{" "}
              {profileData.commissionProfile.hasWaivedFees ? "Yes" : "No"}
            </div>
            {profileData.commissionProfile.customRates && (
              <div>
                Custom Rates: L1:{" "}
                {profileData.commissionProfile.customRates.level1 || "N/A"}, L2:{" "}
                {profileData.commissionProfile.customRates.level2 || "N/A"}, L3:{" "}
                {profileData.commissionProfile.customRates.level3 || "N/A"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
