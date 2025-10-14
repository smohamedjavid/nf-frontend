"use client";

import { UserList } from "@/components/UserList";
import { AddUser } from "@/components/AddUser";
import { SimulateTrade } from "@/components/SimulateTrade";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">NF Referral System</h1>
          <Link
            href="/user"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            View Users
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Users List */}
          <div className="h-200">
            <UserList />
          </div>

          {/* Right Column: Add User and Simulate Trade */}
          <div className="space-y-6">
            <AddUser />
            <SimulateTrade />
          </div>
        </div>
      </div>
    </div>
  );
}
