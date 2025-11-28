"use client";

import React, { useState } from "react";
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

// Mock data
const monthlyData = [
    { month: "Jul", income: 5200, expenses: 3800 },
    { month: "Aug", income: 5400, expenses: 4100 },
    { month: "Sep", income: 5000, expenses: 3900 },
    { month: "Oct", income: 5800, expenses: 4200 },
    { month: "Nov", income: 6000, expenses: 2567 },
    { month: "Dec", income: 5500, expenses: 3200 },
];

const categoryData = [
    { name: "Food & Dining", value: 450, color: "#ef4444" },
    { name: "Transportation", value: 120, color: "#f97316" },
    { name: "Entertainment", value: 80, color: "#ec4899" },
    { name: "Shopping", value: 200, color: "#f59e0b" },
    { name: "Bills & Utilities", value: 385, color: "#8b5cf6" },
    { name: "Healthcare", value: 150, color: "#06b6d4" },
    { name: "Others", value: 182.3, color: "#6366f1" },
];

const netWorthData = [
    { month: " Jul", netWorth: 20500 },
    { month: "Aug", netWorth: 21800 },
    { month: "Sep", netWorth: 22100 },
    { month: "Oct", netWorth: 23600 },
    { month: "Nov", netWorth: 25430 },
    { month: "Dec", netWorth: 27200 },
];

export default function ReportsPage() {
    const [period, setPeriod] = useState<"6m" | "1y" | "all">("6m");

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
                    <button
                        onClick={() => setPeriod("6m")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${period === "6m"
                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        6 Months
                    </button>
                    <button
                        onClick={() => setPeriod("1y")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${period === "1y"
                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        1 Year
                    </button>
                    <button
                        onClick={() => setPeriod("all")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${period === "all"
                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        All Time
                    </button>
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
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
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
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {category.name}: ${category.value.toFixed(0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Net Worth Trend */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6">
                        Net Worth Trend
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
                                name="Net Worth"
                                dot={{ fill: "#465fff", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Growth Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Current
                            </p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                                $25,430
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Growth (6M)
                            </p>
                            <p className="text-xl font-bold text-success-500">+24.1%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Export Reports
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Download your financial data in various formats
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                            Export CSV
                        </button>
                        <button className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
