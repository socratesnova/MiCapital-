import type { Metadata } from "next";
import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { DollarLineIcon, ArrowUpIcon, ArrowDownIcon } from "@/icons";

export const metadata: Metadata = {
  title: "Finance Dashboard | Personal Finance SaaS",
  description: "Overview of your personal finances",
};

export default function FinanceDashboard() {
  // Mock data - to be replaced with real data from Supabase
  const stats = {
    netWorth: 25430.5,
    income: 5800,
    expenses: 2567.3,
    savings: 3232.7,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Finance Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's your financial summary for November 2025
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Net Worth"
          value={`$${stats.netWorth.toLocaleString()}`}
          change={{ value: "+12.5%", isPositive: true }}
          icon={<DollarLineIcon />}
          color="default"
        />
        <StatCard
          title="Income (Month)"
          value={`$${stats.income.toLocaleString()}`}
          change={{ value: "+8.2%", isPositive: true }}
          icon={<ArrowUpIcon />}
          color="success"
        />
        <StatCard
          title="Expenses (Month)"
          value={`$${stats.expenses.toLocaleString()}`}
          change={{ value: "-3.1%", isPositive: true }}
          icon={<ArrowDownIcon />}
          color="error"
        />
        <StatCard
          title="Savings (Month)"
          value={`$${stats.savings.toLocaleString()}`}
          change={{ value: "+45.2%", isPositive: true }}
          icon={<DollarLineIcon />}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Transactions - Takes 2 columns */}
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>

        {/* Budget Overview - Takes 1 column */}
        <div className="xl:col-span-1">
          <BudgetOverview />
        </div>
      </div>
    </div>
  );
}
