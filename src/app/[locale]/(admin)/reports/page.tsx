"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<"6m" | "1y" | "all">("6m");
    const [loading, setLoading] = useState(true);

    // Chart Data States
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [netWorthData, setNetWorthData] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all transactions
                const { data: transactions, error } = await supabase
                    .from("transactions")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("date", { ascending: true });

                if (error) throw error;

                if (!transactions || transactions.length === 0) {
                    setMonthlyData([]);
                    setCategoryData([]);
                    setNetWorthData([]);
                    return;
                }

                processChartData(transactions);

            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, period]);

    const processChartData = (transactions: any[]) => {
        // 1. Process Monthly Income vs Expenses
        const monthlyMap = new Map<string, { income: number; expenses: number; date: Date }>();

        transactions.forEach((t) => {
            const date = new Date(t.date);
            const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, { income: 0, expenses: 0, date });
            }

            const entry = monthlyMap.get(key)!;
            if (t.type === 'income') {
                entry.income += Number(t.amount);
            } else {
                entry.expenses += Number(t.amount);
            }
        });

        // Convert map to array and sort by date
        const monthlyArray = Array.from(monthlyMap.entries())
            .map(([month, data]) => ({
                month,
                income: data.income,
                expenses: data.expenses,
                rawDate: data.date
            }))
            .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        // Filter based on period (simplified logic)
        let filteredMonthly = monthlyArray;
        if (period === '6m') filteredMonthly = monthlyArray.slice(-6);
        if (period === '1y') filteredMonthly = monthlyArray.slice(-12);

        setMonthlyData(filteredMonthly);

        // 2. Process Spending by Category
        const categoryMap = new Map<string, number>();
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const current = categoryMap.get(t.category) || 0;
            categoryMap.set(t.category, current + Number(t.amount));
        });

        const categoryArray = Array.from(categoryMap.entries())
            .map(([name, value], index) => ({
                name,
                value,
                color: `hsl(${index * 45}, 70%, 50%)` // Generate distinct colors
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8); // Top 8 categories

        setCategoryData(categoryArray);

        // 3. Process Net Worth Trend (Cumulative Savings)
        let cumulative = 0;
        // Start with a base if we had 'accounts' table, for now start at 0 or a base
        // We will calculate cumulative savings from transactions
        const trendArray = monthlyArray.map(m => {
            cumulative += (m.income - m.expenses);
            return {
                month: m.month,
                netWorth: cumulative
            };
        });

        // Filter trend same as monthly
        let filteredTrend = trendArray;
        if (period === '6m') filteredTrend = trendArray.slice(-6);
        if (period === '1y') filteredTrend = trendArray.slice(-12);

        setNetWorthData(filteredTrend);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (monthlyData.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
                </div>
                <div className="text-center py-12 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">
                        No transaction data available to generate reports. Start adding transactions!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Financial Reports
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Analyze your financial data with visual reports
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                    {(['6m', '1y', 'all'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${period === p
                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {p === '6m' ? '6 Months' : p === '1y' ? '1 Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Income vs Expenses Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="font-bold text-gray-800 dark:text-white mb-6">
                    Income vs Expenses
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-gray-200 dark:stroke-gray-800"
                        />
                        <XAxis
                            dataKey="month"
                            className="text-gray-600 dark:text-gray-400"
                        />
                        <YAxis className="text-gray-600 dark:text-gray-400" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-white)",
                                border: "1px solid var(--color-gray-200)",
                                borderRadius: "0.5rem",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="income" fill="#10b981" name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Spending by Category */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6">
                        Spending by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent }: { percent?: number }) =>
                                    (percent || 0) > 0.05 ? `${((percent || 0) * 100).toFixed(0)}%` : ''
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {categoryData.map((category) => (
                            <div key={category.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {category.name}: ${category.value.toFixed(0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Net Worth Trend */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6">
                        Cumulative Savings Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={netWorthData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-gray-200 dark:stroke-gray-800"
                            />
                            <XAxis
                                dataKey="month"
                                className="text-gray-600 dark:text-gray-400"
                            />
                            <YAxis className="text-gray-600 dark:text-gray-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--color-white)",
                                    border: "1px solid var(--color-gray-200)",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="netWorth"
                                stroke="#465fff"
                                strokeWidth={3}
                                name="Savings"
                                dot={{ fill: "#465fff", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
