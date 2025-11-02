'use client';

import adminApi from '@/lib/admin-api';
import { StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeedbacksPage() {
	const router = useRouter();
	const [feedbacks, setFeedbacks] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState(null);

	useEffect(() => {
		fetchFeedbacks();
		fetchStats();
	}, [page]);

	const fetchFeedbacks = async () => {
		try {
			setLoading(true);
			const response = await adminApi.get(`/feedbacks?page=${page}&limit=20`);
			setFeedbacks(response.data.data);
			setPagination(response.data.pagination);
		} catch (error) {
			console.error('Error fetching feedbacks:', error);
			alert('Failed to load feedbacks');
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await adminApi.get('/feedbacks/stats');
			setStats(response.data.data);
		} catch (error) {
			console.error('Error fetching stats:', error);
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

	const StarRatingDisplay = ({ rating }) => {
		return (
			<div className="flex items-center gap-1">
				{[...Array(5)].map((_, i) => (
					<StarIcon
						key={i}
						className={`h-4 w-4 ${
							i < rating ? 'text-yellow-400' : 'text-gray-300'
						}`}
					/>
				))}
				<span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
			</div>
		);
	};

	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Customer Feedbacks</h1>
				<p className="mt-2 text-gray-600">View and manage customer feedback submissions</p>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-sm font-medium text-gray-500 mb-2">Total Feedbacks</div>
						<div className="text-3xl font-bold text-gray-900">{stats.totalFeedbacks}</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-sm font-medium text-gray-500 mb-2">Avg Overall Rating</div>
						<div className="flex items-center gap-2">
							<span className="text-3xl font-bold text-yellow-500">{stats.avgOverallRating.toFixed(1)}</span>
							<StarIcon className="h-8 w-8 text-yellow-400" />
						</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-sm font-medium text-gray-500 mb-2">Would Recommend</div>
						<div className="text-3xl font-bold text-green-600">
							{stats.totalFeedbacks > 0
								? Math.round((stats.wouldRecommendCount / stats.totalFeedbacks) * 100)
								: 0}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{stats.wouldRecommendCount} of {stats.totalFeedbacks}
						</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-sm font-medium text-gray-500 mb-2">Avg Connection Quality</div>
						<div className="flex items-center gap-2">
							<span className="text-3xl font-bold text-indigo-600">{stats.avgConnectionStability.toFixed(1)}</span>
							<StarIcon className="h-8 w-8 text-indigo-400" />
						</div>
					</div>
				</div>
			)}

			{/* Feedbacks Table */}
			<div className="bg-white shadow rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">All Feedback Submissions</h2>
				</div>

				{loading ? (
					<div className="p-12 text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
						<p className="mt-4 text-gray-600">Loading feedbacks...</p>
					</div>
				) : feedbacks.length === 0 ? (
					<div className="p-12 text-center text-gray-500">
						No feedbacks submitted yet
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Rack
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Overall Rating
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Recommend
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Submitted
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{feedbacks.map((feedback) => (
									<tr key={feedback._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{feedback.user?.firstName} {feedback.user?.lastName}
											</div>
											<div className="text-sm text-gray-500">{feedback.user?.email}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">{feedback.rack?.name}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<StarRatingDisplay rating={feedback.overallRating} />
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												feedback.wouldRecommend
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}>
												{feedback.wouldRecommend ? 'Yes' : 'No'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(feedback.createdAt)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">
											<button
												onClick={() => router.push(`/admin/feedbacks/${feedback._id}`)}
												className="text-indigo-600 hover:text-indigo-900 font-medium"
											>
												View Details →
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{pagination && pagination.pages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
						<div className="text-sm text-gray-700">
							Showing <span className="font-medium">{((page - 1) * pagination.limit) + 1}</span> to{' '}
							<span className="font-medium">{Math.min(page * pagination.limit, pagination.total)}</span> of{' '}
							<span className="font-medium">{pagination.total}</span> results
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={page === 1}
								className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
								disabled={page === pagination.pages}
								className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
