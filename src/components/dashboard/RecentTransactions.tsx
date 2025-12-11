import React from "react";
import { DollarLineIcon } from "@/icons";

interface Transaction {
    id: string;
    description: string | null;
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
}

interface RecentTransactionsProps {
    data: Transaction[];
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Recent Transactions
                    </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent transactions found.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Recent Transactions
                </h3>
                <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {data.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === "income"
                                    ? "bg-success-50 dark:bg-success-500/10"
                                    : "bg-error-50 dark:bg-error-500/10"
                                    }`}
                            >
                                <DollarLineIcon
                                    className={`w-5 h-5 ${transaction.type === "income"
                                        ? "text-success-500"
                                        : "text-error-500"
                                        }`}
                                />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {transaction.description || transaction.category}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`font-semibold ${transaction.type === "income"
                                ? "text-success-500"
                                : "text-error-500"
                                }`}
                        >
                            {transaction.type === "income" ? "+" : "-"}$
                            {Number(transaction.amount).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
