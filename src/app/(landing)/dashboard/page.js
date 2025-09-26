'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
	const { user, isAuthenticated, loading: authLoading, logout } = useStudentAuth();
	const router = useRouter();
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated) {
			fetchTransactions();
		}
	}, [isAuthenticated, authLoading, router]);

	const fetchTransactions = async () => {
		try {
			// Note: You'll need to create this endpoint in your backend
			const response = await api.get('/transactions/my-transactions');
			if (response.data.success) {
				setTransactions(response.data.data);
			}
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
							<p className="mt-1 text-sm text-gray-600">
								Welcome back, {user?.firstName}!
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => router.push('/')}
								className="text-gray-500 hover:text-gray-700"
							>
								← Back to Home
							</button>
							<button
								onClick={logout}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* Token Balance Card */}
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold">Token Balance</h2>
								<p className="text-indigo-100 mt-1">Available tokens for rack bookings</p>
							</div>
							<div className="text-right">
								<div className="text-4xl font-extrabold">
									{user?.tokens || 0}
								</div>
								<div className="text-indigo-100">tokens</div>
							</div>
						</div>
						{user?.tokens === 0 && (
							<div className="mt-4 p-4 bg-indigo-600 rounded-md">
								<p className="text-sm">
									You do not have any tokens yet.{' '}
									<button
										onClick={() => router.push('/#token-packs')}
										className="underline hover:text-indigo-200"
									>
										Purchase token packs
									</button>{' '}
									to start booking racks.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Transaction History */}
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow rounded-lg">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
						</div>
						<div className="divide-y divide-gray-200">
							{loading ? (
								<div className="p-6 text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
									<p className="mt-2 text-gray-600">Loading transactions...</p>
								</div>
							) : transactions.length === 0 ? (
								<div className="p-6 text-center">
									<p className="text-gray-500">No transactions yet.</p>
									<button
										onClick={() => router.push('/#token-packs')}
										className="mt-2 text-indigo-600 hover:text-indigo-500"
									>
										Buy your first token pack →
									</button>
								</div>
							) : (
								transactions.map((transaction) => (
									<div key={transaction._id} className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												<div className="flex-shrink-0">
													<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
														<span className="text-indigo-600 font-medium">T</span>
													</div>
												</div>
												<div className="ml-4">
													<p className="text-sm font-medium text-gray-900">
														Token Pack Purchase
													</p>
													<p className="text-sm text-gray-500">
														{new Date(transaction.createdAt).toLocaleDateString()}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													₹{(transaction.amount / 100).toFixed(2)}
												</p>
												<p className={`text-sm ${
													transaction.status === 'paid'
														? 'text-green-600'
														: transaction.status === 'failed'
														? 'text-red-600'
														: 'text-yellow-600'
												}`}>
													{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
												</p>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow rounded-lg p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							<button
								onClick={() => router.push('/#token-packs')}
								className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
							>
								<div className="text-center">
									<div className="h-8 w-8 bg-indigo-100 rounded-full mx-auto mb-2 flex items-center justify-center">
										<span className="text-indigo-600">+</span>
									</div>
									<p className="text-sm font-medium text-gray-900">Buy Tokens</p>
									<p className="text-xs text-gray-500">Purchase token packs</p>
								</div>
							</button>
							<button
								onClick={() => router.push('/racks')}
								className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
							>
								<div className="text-center">
									<div className="h-8 w-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
										<span className="text-green-600">🔧</span>
									</div>
									<p className="text-sm font-medium text-gray-900">Book Rack</p>
									<p className="text-xs text-gray-500">Book available racks</p>
								</div>
							</button>
							<button
								onClick={() => router.push('/bookings')}
								className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
							>
								<div className="text-center">
									<div className="h-8 w-8 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
										<span className="text-yellow-600">📋</span>
									</div>
									<p className="text-sm font-medium text-gray-900">My Bookings</p>
									<p className="text-xs text-gray-500">View active bookings</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
