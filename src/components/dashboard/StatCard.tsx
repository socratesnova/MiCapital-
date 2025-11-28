import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

interface StatCardProps {
    title: string;
    value: string;
    change?: {
        value: string;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    color?: "default" | "success" | "error" | "warning";
}

export function StatCard({
    title,
    value,
    change,
    icon,
    trend = "neutral",
    color = "default",
}: StatCardProps) {
    const colorClasses = {
        default: "text-gray-800 dark:text-white",
        success: "text-success-500",
        error: "text-error-500",
        warning: "text-warning-500",
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </h3>
                    <p className={`text-2xl font-bold mt-2 ${colorClasses[color]}`}>
                        {value}
                    </p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            {change.isPositive ? (
                                <ArrowUpIcon className="w-4 h-4 text-success-500" />
                            ) : (
                                <ArrowDownIcon className="w-4 h-4 text-error-500" />
                            )}
                            <span
                                className={`text-sm font-medium ${change.isPositive ? "text-success-500" : "text-error-500"
                                    }`}
                            >
                                {change.value}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="flex-shrink-0 ml-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
