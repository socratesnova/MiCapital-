import React from "react";

interface Budget {
    id: string;
    category: string;
    amount: number; // limit
    spent?: number; // calculated field, might need to be passed or calculated
}

interface BudgetOverviewProps {
    data: Budget[];
}

export function BudgetOverview({ data }: BudgetOverviewProps) {
    // Note: In a real app, 'spent' would come from a join or separate query.
    // For now, we'll simulate 'spent' or assume it's passed if the query is complex.
    // Since our current dashboard query only fetches raw budget rows, we might need to
    // fetch transaction sums per category to populate 'spent'.
    // For this step, I will handle the display assuming 'spent' is 0 if not provided,
    // or we can update the dashboard to fetch this data.

    // Let's assume for this MVP step that we might not have 'spent' yet, 
    // or we can mock it randomly to show UI, OR better, 
    // we should update the parent to fetch this.
    // Given the previous step's dashboard code, we fetched raw budgets.
    // Let's display the budgets we have.

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Budget Overview
                    </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No budgets set.
                </p>
                <button className="w-full mt-2 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    Create Budget
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Budget Overview
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            <div className="space-y-5">
                {data.map((budget) => {
                    // Placeholder for spent calculation until we have the aggregation
                    const spent = budget.spent || 0;
                    const limit = Number(budget.amount);
                    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                    const isOverBudget = percentage > 100;

                    // Simple color logic
                    let color = "bg-brand-500";
                    if (percentage > 80) color = "bg-warning-500";
                    if (isOverBudget) color = "bg-error-500";

                    return (
                        <div key={budget.id}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {budget.category}
                                </span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                    ${spent.toFixed(0)} / ${limit.toFixed(0)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${isOverBudget ? "bg-error-500" : color}`}
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
