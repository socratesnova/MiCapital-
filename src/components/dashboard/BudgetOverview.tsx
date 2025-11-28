import React from "react";

interface BudgetCategory {
    name: string;
    spent: number;
    limit: number;
    color: string;
}

const mockBudgets: BudgetCategory[] = [
    { name: "Food & Dining", spent: 450, limit: 600, color: "bg-error-500" },
    { name: "Transportation", spent: 120, limit: 200, color: "bg-warning-500" },
    { name: "Entertainment", spent: 80, limit: 150, color: "bg-brand-500" },
    { name: "Shopping", spent: 200, limit: 300, color: "bg-theme-purple-500" },
];

export function BudgetOverview() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Budget Overview
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    November 2025
                </span>
            </div>

            <div className="space-y-5">
                {mockBudgets.map((budget) => {
                    const percentage = (budget.spent / budget.limit) * 100;
                    const isOverBudget = percentage > 100;

                    return (
                        <div key={budget.name}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {budget.name}
                                </span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                    ${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${isOverBudget ? "bg-error-500" : budget.color
                                        }`}
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span
                                    className={`text-xs font-medium ${isOverBudget
                                            ? "text-error-500"
                                            : percentage > 80
                                                ? "text-warning-500"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {percentage.toFixed(0)}% used
                                </span>
                                {isOverBudget && (
                                    <span className="text-xs font-medium text-error-500">
                                        Over budget
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-6 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                Manage Budgets
            </button>
        </div>
    );
}
