'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function DashboardContent() {
	const { user, isAuthenticated, loading: authLoading, refreshUser } = useStudentAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const refresh = searchParams.get('refresh');
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated) {
			fetchBookings();
		}
	}, [isAuthenticated, authLoading, router]);

	// Refresh user data when component mounts or when refresh param is present
	useEffect(() => {
		if (isAuthenticated && refreshUser) {
			refreshUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	const fetchBookings = async () => {
		try {
			const response = await api.get('/bookings');
			if (response.data.success) {
				setBookings(response.data.data);
			}
		} catch (error) {
			console.error('Error fetching bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	const isBookingActive = (booking) => {
		const now = new Date();
		const startTime = new Date(booking.startTime);
		const endTime = new Date(booking.endTime);
		return now >= startTime && now <= endTime && booking.status === 'confirmed';
	};

	const getBookingStatus = (booking) => {
		const now = new Date();
		const startTime = new Date(booking.startTime);
		const endTime = new Date(booking.endTime);

		if (booking.status === 'cancelled') return { text: 'Cancelled', color: 'text-red-600 bg-red-50' };
		if (booking.status === 'completed') return { text: 'Completed', color: 'text-gray-600 bg-gray-50' };
		if (now >= startTime && now <= endTime) return { text: 'Active', color: 'text-green-600 bg-green-50' };
		if (now < startTime) return { text: 'Upcoming', color: 'text-blue-600 bg-blue-50' };
		return { text: 'Expired', color: 'text-gray-600 bg-gray-50' };
	};

	const formatDateTime = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZoneName: 'short',
		});
	};

	const formatDuration = (startTime, endTime) => {
		const start = new Date(startTime);
		const end = new Date(endTime);
		const hours = Math.abs(end - start) / 36e5; // milliseconds to hours
		return `${hours} hour${hours !== 1 ? 's' : ''}`;
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
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Welcome back, {user?.firstName}!
					</h1>
					<p className="mt-2 text-gray-600">
						Manage your bookings and token balance from your dashboard
					</p>
				</div>

				{/* Token Balance Card */}
				<div className="mb-8">
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

				{/* My Bookings Section */}
				<div className="mb-8">
					<div className="bg-white shadow rounded-lg">
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
							<button
								onClick={() => router.push('/racks')}
								className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
							>
								Book New Rack →
							</button>
						</div>
						<div className="divide-y divide-gray-200">
							{loading ? (
								<div className="p-8 text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
									<p className="mt-2 text-gray-600">Loading bookings...</p>
								</div>
							) : bookings.length === 0 ? (
								<div className="p-8 text-center">
									<p className="text-gray-500">No bookings yet.</p>
									<button
										onClick={() => router.push('/racks')}
										className="mt-2 text-indigo-600 hover:text-indigo-500"
									>
										Book your first rack →
									</button>
								</div>
							) : (
								bookings.map((booking) => {
									const status = getBookingStatus(booking);
									const isActive = isBookingActive(booking);

									return (
										<div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<h4 className="text-lg font-medium text-gray-900">
															{booking.rack?.name || 'Rack'}
														</h4>
														<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
															{status.text}
														</span>
													</div>

													<div className="space-y-1 text-sm text-gray-600">
														<p>
															<span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
														</p>
														<p>
															<span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
														</p>
														<p>
															<span className="font-medium">Duration:</span> {formatDuration(booking.startTime, booking.endTime)}
														</p>
														<p>
															<span className="font-medium">Token Cost:</span> {booking.tokenCost} tokens
														</p>
														{booking.selectedAciVersion && (
															<p>
																<span className="font-medium">ACI Version:</span> {booking.selectedAciVersion}
															</p>
														)}
													</div>
												</div>

												<div className="ml-4 flex flex-col gap-2">
													{isActive && (
														<button
															onClick={() => {
																router.push(`/rack-access/${booking._id}`);
															}}
															className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
														>
															Access Rack
														</button>
													)}
													{booking.status === 'confirmed' && !isActive && new Date(booking.startTime) > new Date() && (
														<button
															onClick={async () => {
																if (confirm('Are you sure you want to cancel this booking?')) {
																	try {
																		const response = await api.patch(`/bookings/${booking._id}/cancel`);
																		if (response.data.success) {
																			const refundAmount = response.data.data.refundedTokens;
																			alert(`Booking cancelled successfully! ${refundAmount} tokens have been refunded to your account.`);
																			// Refresh both bookings and user data
																			await Promise.all([fetchBookings(), refreshUser()]);
																		}
																	} catch (error) {
																		console.error('Error cancelling booking:', error);
																		alert(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
																	}
																}
															}}
															className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
														>
															Cancel
														</button>
													)}
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div>
					<div className="bg-white shadow rounded-lg p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							<button
								onClick={() => router.push('/token-packs')}
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
								onClick={() => router.push('/poc-solution-testing')}
								className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
							>
								<div className="text-center">
									<div className="h-8 w-8 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
										<span className="text-yellow-600">📋</span>
									</div>
									<p className="text-sm font-medium text-gray-900">POC Testing</p>
									<p className="text-xs text-gray-500">Solution testing services</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Dashboard() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		}>
			<DashboardContent />
		</Suspense>
	);
}
