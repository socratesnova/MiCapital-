"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { DollarLineIcon, ArrowUpIcon, ArrowDownIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function FinanceDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    netWorth: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      try {
        // 1. Fetch Transactions for this month
        const { data: transactions, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startOfMonth.toISOString());

        if (txError) throw txError;

        // Calculate Income & Expenses
        const income = transactions
          ?.filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const expenses = transactions
          ?.filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        // 2. Fetch Net Worth (Sum of Accounts + Assets - Debts)
        // For now, we'll just use a simple calculation or mock if tables aren't populated
        // In a real app, you'd fetch from 'accounts', 'investments', 'debts'
        const netWorth = 25000 + income - expenses; // Placeholder logic

        setStats({
          netWorth,
          income,
          expenses,
          savings: income - expenses,
        });

        // 3. Fetch Recent Transactions (Limit 5)
        const { data: recent, error: recentError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(5);

        if (recentError) throw recentError;
        setRecentTransactions(recent || []);

        // 4. Fetch Budgets
        const { data: budgetData, error: budgetError } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id);

        if (budgetError) throw budgetError;
        setBudgets(budgetData || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Finance Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.user_metadata?.full_name || "User"}! Here's your financial summary.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Net Worth"
          value={`$${stats.netWorth.toLocaleString()}`}
          change={{ value: "+2.5%", isPositive: true }}
          icon={<DollarLineIcon />}
          color="default"
        />
        <StatCard
          title="Income (Month)"
          value={`$${stats.income.toLocaleString()}`}
          change={{ value: "+0%", isPositive: true }}
          icon={<ArrowUpIcon />}
          color="success"
        />
        <StatCard
          title="Expenses (Month)"
          value={`$${stats.expenses.toLocaleString()}`}
          change={{ value: "-0%", isPositive: true }}
          icon={<ArrowDownIcon />}
          color="error"
        />
        <StatCard
          title="Savings (Month)"
          value={`$${stats.savings.toLocaleString()}`}
          change={{ value: stats.savings >= 0 ? "+100%" : "-100%", isPositive: stats.savings >= 0 }}
          icon={<DollarLineIcon />}
          color={stats.savings >= 0 ? "success" : "error"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Transactions - Takes 2 columns */}
        <div className="xl:col-span-2">
          <RecentTransactions data={recentTransactions} />
        </div>

        {/* Budget Overview - Takes 1 column */}
        <div className="xl:col-span-1">
          <BudgetOverview data={budgets} />
        </div>
      </div>
    </div>
  );
}
