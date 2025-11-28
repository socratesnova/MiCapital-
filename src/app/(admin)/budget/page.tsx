"use client";

import React, { useState } from "react";
import { PlusIcon } from "@/icons";

interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    period: "monthly" | "weekly";
}

const mockBudgets: Budget[] = [
    {
        id: "1",
        category: "Food & Dining",
        limit: 600,
        spent: 450,
        period: "monthly",
    },
    {
        id: "2",
        category: "Transportation",
        limit: 200,
        spent: 120,
        period: "monthly",
    },
    {
        id: "3",
        category: "Entertainment",
        limit: 150,
        spent: 80,
        period: "monthly",
    },
    {
        id: "4",
        category: "Shopping",
        limit: 300,
        spent: 200,
        period: "monthly",
    },
    {
        id: "5",
        category: "Bills & Utilities",
        limit: 400,
        spent: 385,
        period: "monthly",
    },
];

export default function BudgetPage() {
    const [budgets] = useState<Budget[]>(mockBudgets);

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetUtilization = (totalSpent / totalBudget) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Budget Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track your spending against budget limits
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition">
                    <PlusIcon className="w-5 h-5" />
                    Add Budget
                </button>
            </div>

            {/* Overall Budget Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Total Budget - November 2025
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${totalSpent.toFixed(0)} of ${totalBudget.toFixed(0)} used
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">
                            {budgetUtilization.toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Budget Used
                        </p>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${budgetUtilization > 100
                                ? "bg-error-500"
                                : budgetUtilization > 80
                                    ? "bg-warning-500"
                                    : "bg-success-500"
                            }`}
                        style={{
                            width: `${Math.min(budgetUtilization, 100)}%`,
                        }}
                    />
                </div>

                {/* Remaining */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Remaining
                    </span>
                    <span
                        className={`text-sm font-semibold ${totalBudget - totalSpent >= 0
                                ? "text-success-500"
                                : "text-error-500"
                            }`}
                    >
                        ${Math.abs(totalBudget - totalSpent).toFixed(0)}
                        {totalBudget - totalSpent < 0 && " over budget"}
                    </span>
                </div>
            </div>

            {/* Budget Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => {
                    const percentage = (budget.spent / budget.limit) * 100;
                    const remaining = budget.limit - budget.spent;
                    const isOverBudget = percentage > 100;
                    const isNearLimit = percentage > 80 && !isOverBudget;

                    return (
                        <div
                            key={budget.id}
                            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
                        >
                            {/* Category Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">
                                        {budget.category}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {budget.period === "monthly" ? "Monthly" : "Weekly"} Budget
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        ${budget.spent.toFixed(0)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        of ${budget.limit.toFixed(0)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full transition-all ${isOverBudget
                                                ? "bg-error-500"
                                                : isNearLimit
                                                    ? "bg-warning-500"
                                                    : "bg-brand-500"
                                            }`}
                                        style={{
                                            width: `${Math.min(percentage, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium ${isOverBudget
                                            ? "text-error-500"
                                            : isNearLimit
                                                ? "text-warning-500"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    {percentage.toFixed(0)}% used
                                </span>
                                <span
                                    className={`text-sm font-medium ${isOverBudget
                                            ? "text-error-500"
                                            : "text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    {isOverBudget ? (
                                        <>
                                            ${Math.abs(remaining).toFixed(0)} over
                                        </>
                                    ) : (
                                        <>
                                            ${remaining.toFixed(0)} left
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* Alert Badge */}
                            {isOverBudget && (
                                <div className="mt-3 px-3 py-2 bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 rounded-lg">
                                    <p className="text-sm font-medium text-error-700 dark:text-error-400">
                                        ⚠️ Over budget limit
                                    </p>
                                </div>
                            )}
                            {isNearLimit && (
                                <div className="mt-3 px-3 py-2 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/20 rounded-lg">
                                    <p className="text-sm font-medium text-warning-700 dark:text-warning-400">
                                        ⚡ Approaching limit
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Tips Card */}
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5">
                <h3 className="font-semibold text-brand-800 dark:text-brand-300 mb-2">
                    💡 Budget Tips
                </h3>
                <ul className="space-y-2 text-sm text-brand-700 dark:text-brand-400">
                    <li>• Review your budgets at the start of each month</li>
                    <li>• Set realistic limits based on your income</li>
                    <li>• Adjust budgets seasonally (holidays, summer, etc.)</li>
                    <li>• Track variable expenses like food and entertainment closely</li>
                </ul>
            </div>
        </div>
    );
}
