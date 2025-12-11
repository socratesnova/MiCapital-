"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Goal {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    category: string;
    status: string;
}

import { AddGoalModal } from "@/components/modals/AddGoalModal";

export default function GoalsPage() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGoals = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", user.id)
                .order("deadline", { ascending: true });

            if (error) throw error;
            setGoals(data || []);
        } catch (error) {
            console.error("Error fetching goals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    const totalGoalsTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
    const totalGoalsSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
    const overallProgress = totalGoalsTarget > 0 ? (totalGoalsSaved / totalGoalsTarget) * 100 : 0;

    if (loading && goals.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AddGoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchGoals}
            />

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
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition"
                >
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
            {goals.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">
                        No goals found. Create one to start saving!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => {
                        const progress = (goal.current_amount / goal.target_amount) * 100;
                        const remaining = goal.target_amount - goal.current_amount;
                        const daysUntilDeadline = goal.deadline ? Math.ceil(
                            (new Date(goal.deadline).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) : 0;
                        const isCompleted = progress >= 100;
                        const isUrgent = daysUntilDeadline < 30 && !isCompleted && goal.deadline;

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
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                            {goal.category || "General"}
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
                                            ${goal.current_amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Target
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                            ${goal.target_amount.toLocaleString()}
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
                                {goal.deadline && (
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
                                                {new Date(goal.deadline).toLocaleDateString()}
                                                {!isCompleted && daysUntilDeadline > 0 && ` (${daysUntilDeadline} days)`}
                                                {!isCompleted && daysUntilDeadline <= 0 && " (Overdue)"}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <button className="w-full mt-4 py-2.5 px-4 rounded-lg border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 font-medium transition">
                                    Add Funds
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
