"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface AmortizationRow {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

interface Debt {
    id: string;
    name: string;
    current_balance: number;
    interest_rate: number;
    minimum_payment: number;
    type: string;
}

export default function LoansPage() {
    // Auth & Data Fetching
    const { user } = useAuth();
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loadingDebts, setLoadingDebts] = useState(true);

    // Calculator State
    const [principal, setPrincipal] = useState("10000");
    const [interestRate, setInterestRate] = useState("5.5");
    const [loanTerm, setLoanTerm] = useState("24");
    const [extraPayment, setExtraPayment] = useState("0");

    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [payoffDate, setPayoffDate] = useState("");
    const [schedule, setSchedule] = useState<AmortizationRow[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchDebts = async () => {
            setLoadingDebts(true);
            try {
                const { data, error } = await supabase
                    .from("debts")
                    .select("*")
                    .eq("user_id", user.id);

                if (error) throw error;
                setDebts(data || []);
            } catch (error) {
                console.error("Error fetching debts:", error);
            } finally {
                setLoadingDebts(false);
            }
        };

        fetchDebts();
    }, [user]);

    useEffect(() => {
        calculateLoan();
    }, [principal, interestRate, loanTerm, extraPayment]);

    const calculateLoan = () => {
        const P = parseFloat(principal) || 0;
        const annualRate = parseFloat(interestRate) || 0;
        const months = parseInt(loanTerm) || 0;
        const extra = parseFloat(extraPayment) || 0;

        if (P <= 0 || annualRate <= 0 || months <= 0) {
            setMonthlyPayment(0);
            setTotalInterest(0);
            setTotalPayment(0);
            setSchedule([]);
            return;
        }

        const monthlyRate = annualRate / 100 / 12;

        // Calculate monthly payment (without extra)
        const payment =
            (P * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        let balance = P;
        let totalInterestPaid = 0;
        const amortizationSchedule: AmortizationRow[] = [];
        let month = 1;

        while (balance > 0.01 && month <= months * 2) {
            // Limit to prevent infinite loop
            const interestPayment = balance * monthlyRate;
            const principalPayment = Math.min(
                payment + extra - interestPayment,
                balance
            );
            balance -= principalPayment;
            totalInterestPaid += interestPayment;

            amortizationSchedule.push({
                month,
                payment: payment + extra,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(balance, 0),
            });

            month++;
        }

        setMonthlyPayment(payment);
        setTotalInterest(totalInterestPaid);
        setTotalPayment(P + totalInterestPaid);
        setSchedule(amortizationSchedule);

        // Calculate payoff date
        const payoffMonths = amortizationSchedule.length;
        const today = new Date();
        const payoff = new Date(
            today.getFullYear(),
            today.getMonth() + payoffMonths,
            today.getDate()
        );
        setPayoffDate(payoff.toLocaleDateString());
    };

    const savings = schedule.length > 0 ? parseInt(loanTerm) - schedule.length : 0;
    const interestSavings =
        totalInterest > 0
            ? (parseFloat(principal) *
                (parseFloat(interestRate) / 100 / 12) *
                parseInt(loanTerm) -
                totalInterest)
            : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Loans & Debt Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track your debts and calculate payoff strategies
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition">
                    <PlusIcon className="w-5 h-5" />
                    Add Debt
                </button>
            </div>

            {/* Active Debts List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Active Debts
                </h2>
                {loadingDebts ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                    </div>
                ) : debts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            No debts found. Great job! Or add one to start tracking.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {debts.map((debt) => (
                            <div
                                key={debt.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white">
                                            {debt.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            {debt.type.replace("_", " ")}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-error-50 text-error-600 text-xs font-medium rounded-md dark:bg-error-500/10 dark:text-error-400">
                                        {debt.interest_rate}% APR
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Balance</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">
                                            ${debt.current_balance.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Min Payment</span>
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            ${debt.minimum_payment?.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Calculator Section */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Loan Calculator
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Calculator Input */}
                    <div className="xl:col-span-1">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] sticky top-6">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-6">
                                Loan Details
                            </h3>

                            <div className="space-y-5">
                                {/* Principal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Loan Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            value={principal}
                                            onChange={(e) => setPrincipal(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>

                                {/* Interest Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Annual Interest Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(e.target.value)}
                                            className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Loan Term */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Loan Term (months)
                                    </label>
                                    <input
                                        type="number"
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                {/* Extra Payment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Extra Monthly Payment (Optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            value={extraPayment}
                                            onChange={(e) => setExtraPayment(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Monthly Payment
                                </p>
                                <p className="text-3xl font-bold text-brand-500 mt-2">
                                    ${monthlyPayment.toFixed(2)}
                                </p>
                                {parseFloat(extraPayment) > 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        + ${extraPayment} extra
                                    </p>
                                )}
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Interest
                                </p>
                                <p className="text-3xl font-bold text-error-500 mt-2">
                                    ${totalInterest.toFixed(2)}
                                </p>
                                {interestSavings > 0 && (
                                    <p className="text-xs text-success-500 mt-1">
                                        Save ${interestSavings.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Payment
                                </p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                                    ${totalPayment.toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Payoff Date
                                </p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white mt-2">
                                    {payoffDate || "N/A"}
                                </p>
                                {savings > 0 && (
                                    <p className="text-xs text-success-500 mt-1">
                                        {savings} months earlier
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Amortization Schedule */}
                        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="font-bold text-gray-800 dark:text-white">
                                    Amortization Schedule
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {schedule.length} monthly payments
                                </p>
                            </div>

                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                Month
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                Principal
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                Interest
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                                Balance
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {schedule.map((row) => (
                                            <tr
                                                key={row.month}
                                                className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                            >
                                                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {row.month}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right font-medium text-gray-800 dark:text-white">
                                                    ${row.payment.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right text-success-500">
                                                    ${row.principal.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right text-error-500">
                                                    ${row.interest.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800 dark:text-white">
                                                    ${row.balance.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
