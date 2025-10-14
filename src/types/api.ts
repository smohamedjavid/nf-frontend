// API types
export interface User {
  id: string;
  name: string;
  referralCode?: string;
  referrerId?: string;
  isKOL: boolean;
  hasWaivedFees: boolean;
  createdAt: string;
  _count: {
    referrals: number;
    commissions: number;
  };
}

export interface ReferralNetwork {
  rootUser: User;
  network: NetworkUser[];
  stats: {
    totalReferrals: number;
    level1Count: number;
    level2Count: number;
    level3Count: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NetworkUser extends User {
  level: number;
  referrerId: string;
}

export interface Earnings {
  summary: {
    totalEarnings: string;
    totalClaimed: string;
    totalUnclaimed: string;
    totalReferredUsers: number;
    levelBreakdown: {
      1: number;
      2: number;
      3: number;
    };
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
  };
  earnings: Earning[];
}

export interface Earning {
  referredUser: User;
  level: number;
  totalCommissions: number;
  claimed: string;
  unclaimed: string;
  total: string;
  commissions: Commission[];
}

export interface Commission {
  id: string;
  amount: string;
  token: string;
  claimed: boolean;
  tradeId: string;
  createdAt: string;
}

export interface RegisterUserRequest {
  name: string;
  referralCode?: string;
}

export interface RegisterUserResponse {
  userId: string;
  message: string;
  referrerValidated?: boolean;
}

export interface GenerateCodeRequest {
  userId: string;
}

export interface GenerateCodeResponse {
  referralCode: string;
}

export interface TradeRequest {
  userId: string;
  volume: number;
  fee: number;
  tradeType?: string;
}

export interface TradeResponse {
  message: string;
  webhookId: string;
  jobId: string;
  estimatedProcessingTime: string;
}

export interface ClaimRequest {
  userId: string;
  claimId?: string;
  claimAll?: boolean;
  token?: string;
}

export interface ClaimResponse {
  success: boolean;
  claimed: string;
  token: string;
  commissionId?: string;
  commissionsClaimed?: number;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedUsersResponse {
  data: User[];
  pagination: PaginationMeta;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId?: string;
}
