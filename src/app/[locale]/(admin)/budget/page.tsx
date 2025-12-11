"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Budget {
    id: string;
    category: string;
    amount: number; // limit
    period: "monthly" | "weekly" | "yearly";
    spent: number; // calculated
}

import { AddBudgetModal } from "@/components/modals/AddBudgetModal";

export default function BudgetPage() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch Budgets
            const { data: budgetData, error: budgetError } = await supabase
                .from("budgets")
                .select("*")
                .eq("user_id", user.id);

            if (budgetError) throw budgetError;

            // 2. Fetch Transactions for this month to calculate 'spent'
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { data: transactions, error: txError } = await supabase
                .from("transactions")
                .select("amount, category, type")
                .eq("user_id", user.id)
                .eq("type", "expense")
                .gte("date", startOfMonth.toISOString());

            if (txError) throw txError;

            // 3. Calculate spent per category
            const spentByCategory: Record<string, number> = {};
            transactions?.forEach((t) => {
                const cat = t.category;
                spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount);
            });

            // 4. Merge data
            const mergedBudgets: Budget[] = (budgetData || []).map((b) => ({
                id: b.id,
                category: b.category,
                amount: b.amount,
                period: b.period,
                spent: spentByCategory[b.category] || 0,
            }));

            setBudgets(mergedBudgets);

        } catch (error) {
            console.error("Error fetching budget data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    if (loading && budgets.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AddBudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

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
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Budget
                </button>
            </div>

            {/* Overall Budget Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Total Budget - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
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
            {budgets.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">
                        No budgets found. Create one to start tracking!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map((budget) => {
                        const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                        const remaining = budget.amount - budget.spent;
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
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                            {budget.period} Budget
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            ${budget.spent.toFixed(0)}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            of ${budget.amount.toFixed(0)}
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
            )}

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
