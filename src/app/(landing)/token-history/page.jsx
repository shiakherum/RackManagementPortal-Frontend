'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ChartBarIcon,
	ClockIcon
} from '@heroicons/react/24/outline';

export default function TokenHistoryPage() {
	const { user, isAuthenticated, loading: authLoading } = useStudentAuth();
	const router = useRouter();
	const [balanceSheet, setBalanceSheet] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated) {
			fetchBalanceSheet();
		}
	}, [isAuthenticated, authLoading, router]);

	const fetchBalanceSheet = async () => {
		try {
			const response = await api.get('/transactions/token-balance-sheet');
			if (response.data.success) {
				setBalanceSheet(response.data.data);
			}
		} catch (error) {
			console.error('Error fetching balance sheet:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	if (authLoading || loading) {
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
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<button
						onClick={() => router.push('/dashboard')}
						className="text-indigo-600 hover:text-indigo-500 mb-4"
					>
						← Back to Dashboard
					</button>
					<h1 className="text-3xl font-bold text-gray-900">Token Balance Sheet</h1>
					<p className="mt-2 text-gray-600">
						Complete history of your token purchases and usage
					</p>
				</div>

				{/* Summary Cards */}
				{balanceSheet && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500">Current Balance</p>
									<p className="mt-2 text-3xl font-bold text-indigo-600">
										{balanceSheet.summary.currentBalance}
									</p>
								</div>
								<div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
									<ChartBarIcon className="h-6 w-6 text-indigo-600" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500">Total Purchased</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{balanceSheet.summary.totalPurchased}
									</p>
								</div>
								<div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
									<ArrowUpIcon className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500">Total Spent</p>
									<p className="mt-2 text-3xl font-bold text-red-600">
										{balanceSheet.summary.totalSpent}
									</p>
								</div>
								<div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
									<ArrowDownIcon className="h-6 w-6 text-red-600" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500">Total Refunded</p>
									<p className="mt-2 text-3xl font-bold text-blue-600">
										{balanceSheet.summary.totalRefunded}
									</p>
								</div>
								<div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
									<ClockIcon className="h-6 w-6 text-blue-600" />
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Transaction History */}
				<div className="bg-white shadow rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
						<p className="text-xs text-gray-500 mt-1">
							Note: Total purchased is calculated from your balance history. Individual token pack details may be unavailable for older purchases.
						</p>
					</div>

					{balanceSheet?.history?.length === 0 ? (
						<div className="p-12 text-center text-gray-500">
							No transactions yet
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Description
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Reference
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Tokens
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Balance
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{balanceSheet?.history?.map((item, index) => (
										<tr key={index} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{formatDate(item.date)}
											</td>
											<td className="px-6 py-4 text-sm text-gray-900">
												<div>
													{item.description}
												</div>
												{item.startTime && item.endTime && (
													<div className="text-xs text-gray-500 mt-1">
														{formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{item.bookingId && (
													<span className="font-mono text-xs">
														Booking: {String(item.bookingId).slice(-8)}
													</span>
												)}
												{item.transactionId && (
													<span className="font-mono text-xs">
														Txn: {String(item.transactionId).slice(-8)}
													</span>
												)}
											</td>
											<td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
												item.type === 'credit' ? 'text-green-600' : 'text-red-600'
											}`}>
												{item.type === 'credit' ? '+' : ''}{item.tokens}
												{item.isUnknownPack && item.tokens === 0 && (
													<div className="text-xs text-gray-500 font-normal mt-1">
														(Pack deleted)
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
												{item.balance}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
