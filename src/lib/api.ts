import type {
  User,
  ReferralNetwork,
  Earnings,
  RegisterUserRequest,
  RegisterUserResponse,
  GenerateCodeRequest,
  GenerateCodeResponse,
  TradeRequest,
  TradeResponse,
  ClaimRequest,
  ClaimResponse,
  PaginatedUsersResponse,
} from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export const api = {
  // Users
  getUsers: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedUsersResponse> => {
    // Validate and sanitize inputs
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 20);

    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: limitNum.toString(),
    });

    const res = await fetch(`${API_BASE}/users?${params}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const response = await res.json();

    return response; // Return the full response object
  },

  getUser: async (userId: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    const response = await res.json();
    return response.data;
  },

  // Referral
  registerUser: async (
    data: RegisterUserRequest
  ): Promise<RegisterUserResponse> => {
    const res = await fetch(`${API_BASE}/referral/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to register user");
    const response = await res.json();
    return response.data;
  },

  generateCode: async (
    data: GenerateCodeRequest
  ): Promise<GenerateCodeResponse> => {
    const res = await fetch(`${API_BASE}/referral/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to generate code");
    const response = await res.json();
    return response.data;
  },

  getReferralNetwork: async (
    userId: string,
    page = 1,
    limit = 50
  ): Promise<ReferralNetwork> => {
    const params = new URLSearchParams({
      userId,
      page: page.toString(),
      limit: limit.toString(),
    });
    const res = await fetch(`${API_BASE}/referral/network?${params}`);
    if (!res.ok) throw new Error("Failed to fetch referral network");
    const response = await res.json();
    return response.data;
  },

  getEarnings: async (
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Earnings> => {
    const params = new URLSearchParams({
      userId,
    });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await fetch(`${API_BASE}/referral/earnings?${params}`);
    if (!res.ok) throw new Error("Failed to fetch earnings");
    const response = await res.json();
    return response.data;
  },

  claimEarnings: async (data: ClaimRequest): Promise<ClaimResponse> => {
    const res = await fetch(`${API_BASE}/referral/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to claim earnings");
    const response = await res.json();
    return response.data;
  },

  // Webhook
  simulateTrade: async (data: TradeRequest): Promise<TradeResponse> => {
    const res = await fetch(`${API_BASE}/webhook/trade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to simulate trade");
    const response = await res.json();
    return response.data;
  },

  // Admin APIs
  getUserCommissionProfile: async (
    userId: string
  ): Promise<{
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
  }> => {
    const res = await fetch(
      `${API_BASE}/admin/users/${userId}/commission-profile`
    );
    if (!res.ok) throw new Error("Failed to fetch user commission profile");
    const response = await res.json();
    return response.data;
  },

  updateUserCommissionProfile: async (
    userId: string,
    data: {
      isKOL?: boolean;
      hasWaivedFees?: boolean;
      customRates?: {
        level1?: number;
        level2?: number;
        level3?: number;
      };
    }
  ): Promise<{
    userId: string;
    name: string;
    commissionProfile: {
      isKOL: boolean;
      hasWaivedFees: boolean;
      customRates?: any;
    };
    message: string;
  }> => {
    const res = await fetch(
      `${API_BASE}/admin/users/${userId}/commission-profile`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error("Failed to update user commission profile");
    const response = await res.json();
    return response.data;
  },
};
