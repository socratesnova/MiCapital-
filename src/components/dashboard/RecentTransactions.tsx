import React from "react";
import { DollarLineIcon } from "@/icons";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
}

const mockTransactions: Transaction[] = [
    {
        id: "1",
        description: "Salary Payment",
        amount: 5000,
        category: "Salary",
        date: "2025-11-25",
        type: "income",
    },
    {
        id: "2",
        description: "Grocery Shopping",
        amount: 150.5,
        category: "Food & Dining",
        date: "2025-11-24",
        type: "expense",
    },
    {
        id: "3",
        description: "Netflix Subscription",
        amount: 15.99,
        category: "Entertainment",
        date: "2025-11-23",
        type: "expense",
    },
    {
        id: "4",
        description: "Freelance Project",
        amount: 800,
        category: "Freelance",
        date: "2025-11-22",
        type: "income",
    },
    {
        id: "5",
        description: "Electric Bill",
        amount: 85.3,
        category: "Bills & Utilities",
        date: "2025-11-21",
        type: "expense",
    },
];

export function RecentTransactions() {
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
                {mockTransactions.map((transaction) => (
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
                                    {transaction.description}
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
                            {transaction.amount.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
