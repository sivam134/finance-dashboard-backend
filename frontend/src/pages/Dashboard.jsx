import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { LogOut, TrendingUp, DollarSign, CreditCard, User } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState([
        { id: 1, description: 'Groceries', amount: 150, category: 'Food', date: '2025-11-20' },
        { id: 2, description: 'Electricity Bill', amount: 80, category: 'Utilities', date: '2025-11-18' },
        { id: 3, description: 'Internet', amount: 60, category: 'Utilities', date: '2025-11-15' },
        { id: 4, description: 'Dining Out', amount: 45, category: 'Food', date: '2025-11-12' },
        { id: 5, description: 'Gas', amount: 50, category: 'Transport', date: '2025-11-10' },
    ]);

    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Food', date: '' });

    const addExpense = (e) => {
        e.preventDefault();
        if (!newExpense.description || !newExpense.amount || !newExpense.date) return;
        setExpenses([...expenses, { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount) }]);
        setNewExpense({ description: '', amount: '', category: 'Food', date: '' });
    };

    const categories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Other'];
    const categoryData = categories.map(cat =>
        expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
    );

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const doughnutData = {
        labels: categories,
        datasets: [
            {
                data: categoryData,
                backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
                hoverBackgroundColor: ['#7C3AED', '#DB2777', '#D97706', '#059669', '#2563EB'],
                borderWidth: 0,
            },
        ],
    };

    const barData = {
        labels: expenses.map(e => e.date),
        datasets: [
            {
                label: 'Daily Expenses',
                data: expenses.map(e => e.amount),
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderRadius: 8,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Finance Tracker</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                                <User className="h-5 w-5 text-purple-400" />
                                <span className="text-white font-medium">{user?.username}</span>
                                <span className="text-purple-400 text-sm">({user?.role})</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm font-medium">Total Expenses</p>
                                <p className="text-3xl font-bold text-white mt-2">${totalExpenses.toFixed(2)}</p>
                            </div>
                            <div className="bg-purple-500/30 p-3 rounded-xl">
                                <DollarSign className="h-8 w-8 text-purple-300" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 text-sm font-medium">Transactions</p>
                                <p className="text-3xl font-bold text-white mt-2">{expenses.length}</p>
                            </div>
                            <div className="bg-blue-500/30 p-3 rounded-xl">
                                <CreditCard className="h-8 w-8 text-blue-300" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-200 text-sm font-medium">Avg per Day</p>
                                <p className="text-3xl font-bold text-white mt-2">${(totalExpenses / expenses.length).toFixed(2)}</p>
                            </div>
                            <div className="bg-green-500/30 p-3 rounded-xl">
                                <TrendingUp className="h-8 w-8 text-green-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Charts */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Expense Breakdown</h2>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#fff' } } } }} />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Spending Trend</h2>
                        <div className="h-64">
                            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Add Form */}
                    <div className="md:col-span-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-fit">
                        <h2 className="text-xl font-semibold text-white mb-4">Add Expense</h2>
                        <form onSubmit={addExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="e.g. Groceries"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [&>option]:bg-slate-800 [&>option]:text-white"
                                >
                                    {categories.map(cat => <option key={cat} value={cat} className="bg-slate-800 text-white py-2">{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
                            >
                                Add Expense
                            </button>
                        </form>
                    </div>

                    {/* Transactions List */}
                    <div className="md:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-purple-200 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((expense) => (
                                        <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{expense.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{expense.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-300">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-right font-bold">${expense.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
