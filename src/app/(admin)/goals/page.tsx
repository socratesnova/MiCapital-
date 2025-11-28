"use client";

import React, { useState } from "react";
import { PlusIcon } from "@/icons";

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
}

const mockGoals: Goal[] = [
    {
        id: "1",
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 6500,
        deadline: "2025-12-31",
        category: "Savings",
    },
    {
        id: "2",
        name: "Vacation to Europe",
        targetAmount: 5000,
        currentAmount: 2300,
        deadline: "2026-06-01",
        category: "Travel",
    },
    {
        id: "3",
        name: "New Car Down Payment",
        targetAmount: 8000,
        currentAmount: 4200,
        deadline: "2026-03-01",
        category: "Vehicle",
    },
    {
        id: "4",
        name: "Home Office Setup",
        targetAmount: 2000,
        currentAmount: 1800,
        deadline: "2025-12-15",
        category: "Home",
    },
];

export default function GoalsPage() {
    const [goals] = useState<Goal[]>(mockGoals);

    const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalGoalsSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = (totalGoalsSaved / totalGoalsTarget) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Savings Goals
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track progress towards your financial goals
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition">
                    <PlusIcon className="w-5 h-5" />
                    Create Goal
                </button>
            </div>

            {/* Overall Progress Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Overall Progress
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {goals.length} active goals
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-brand-500">
                            {overallProgress.toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Complete
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Total Saved
                        </p>
                        <p className="text-2xl font-bold text-success-500">
                            ${totalGoalsSaved.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Total Target
                        </p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                            ${totalGoalsTarget.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const daysUntilDeadline = Math.ceil(
                        (new Date(goal.deadline).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const isCompleted = progress >= 100;
                    const isUrgent = daysUntilDeadline < 30 && !isCompleted;

                    return (
                        <div
                            key={goal.id}
                            className={`rounded-2xl border p-6 ${isCompleted
                                    ? "border-success-200 bg-success-50 dark:border-success-500/20 dark:bg-success-500/5"
                                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                                }`}
                        >
                            {/* Goal Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">
                                        {goal.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {goal.category}
                                    </p>
                                </div>
                                {isCompleted && (
                                    <span className="px-3 py-1 bg-success-500 text-white text-xs font-semibold rounded-full">
                                        ✓ Complete
                                    </span>
                                )}
                            </div>

                            {/* Circular Progress */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <svg className="transform -rotate-90 w-32 h-32">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-200 dark:text-gray-700"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={`${2 * Math.PI * 56}`}
                                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(progress, 100) / 100)
                                                }`}
                                            className={`${isCompleted
                                                    ? "text-success-500"
                                                    : "text-brand-500"
                                                } transition-all duration-500`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {Math.min(progress, 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Current
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                        ${goal.currentAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Target
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                        ${goal.targetAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                                        Remaining
                                    </span>
                                    <span className="text-sm font-bold text-brand-500">
                                        ${remaining.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Deadline Info */}
                            <div
                                className={`px-3 py-2 rounded-lg ${isCompleted
                                        ? "bg-success-100 dark:bg-success-500/10"
                                        : isUrgent
                                            ? "bg-warning-50 dark:bg-warning-500/10"
                                            : "bg-gray-100 dark:bg-gray-800"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        Deadline
                                    </span>
                                    <span
                                        className={`text-xs font-medium ${isCompleted
                                                ? "text-success-600 dark:text-success-400"
                                                : isUrgent
                                                    ? "text-warning-600 dark:text-warning-400"
                                                    : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {new Date(goal.deadline).toLocaleDateString()} (
                                        {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : "Overdue"})
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full mt-4 py-2.5 px-4 rounded-lg border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 font-medium transition">
                                Add Funds
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
