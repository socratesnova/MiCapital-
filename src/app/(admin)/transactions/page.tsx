"use client";

import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

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
    {
        id: "6",
        description: "Gas Station",
        amount: 45.0,
        category: "Transportation",
        date: "2025-11-20",
        type: "expense",
    },
    {
        id: "7",
        description: "Bonus Payment",
        amount: 1200,
        category: "Salary",
        date: "2025-11-19",
        type: "income",
    },
    {
        id: "8",
        description: "Restaurant Dinner",
        amount: 75.5,
        category: "Food & Dining",
        date: "2025-11-18",
        type: "expense",
    },
];

export default function TransactionsPage() {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = transactions.filter((t) => {
        const matchesFilter = filter === "all" || t.type === filter;
        const matchesSearch =
            t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Transactions
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track all your income and expenses
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition">
                    <PlusIcon className="w-5 h-5" />
                    Add Transaction
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Income
                    </p>
                    <p className="text-2xl font-bold text-success-500 mt-2">
                        +${totalIncome.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-error-500 mt-2">
                        -${totalExpense.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
                    <p
                        className={`text-2xl font-bold mt-2 ${totalIncome - totalExpense >= 0
                                ? "text-success-500"
                                : "text-error-500"
                            }`}
                    >
                        ${(totalIncome - totalExpense).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === "all"
                                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("income")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === "income"
                                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFilter("expense")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === "expense"
                                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            Expenses
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {transaction.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${transaction.type === "income"
                                                    ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                                                    : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400"
                                                }`}
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span
                                            className={`text-sm font-semibold ${transaction.type === "income"
                                                    ? "text-success-500"
                                                    : "text-error-500"
                                                }`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"}$
                                            {transaction.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-error-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition">
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No transactions found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
