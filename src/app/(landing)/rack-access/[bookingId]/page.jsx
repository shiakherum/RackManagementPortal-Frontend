'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RackAccessPage({ params }) {
	const { bookingId } = params;
	const { isAuthenticated, loading: authLoading } = useStudentAuth();
	const router = useRouter();
	const [booking, setBooking] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [timeRemaining, setTimeRemaining] = useState('');
	const [startingAccess, setStartingAccess] = useState(false);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated) {
			fetchBookingDetails();
		}
	}, [isAuthenticated, authLoading, bookingId]);

	// Timer countdown
	useEffect(() => {
		if (!booking) return;

		const interval = setInterval(() => {
			const now = new Date();
			const endTime = new Date(booking.endTime);
			const diff = endTime - now;

			if (diff <= 0) {
				setTimeRemaining('Booking Expired');
				clearInterval(interval);
			} else {
				const hours = Math.floor(diff / (1000 * 60 * 60));
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diff % (1000 * 60)) / 1000);
				setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [booking]);

	const fetchBookingDetails = async () => {
		try {
			const response = await api.get(`/rack-access/${bookingId}`);
			setBooking(response.data.data);
		} catch (error) {
			console.error('Error fetching booking:', error);
			setError(error.response?.data?.message || 'Failed to load booking details');
		} finally {
			setLoading(false);
		}
	};

	const handleStartAccess = async () => {
		setStartingAccess(true);
		setError('');
		try {
			const response = await api.post(`/rack-access/${bookingId}/start`);
			if (response.data.success) {
				// Refresh booking details to get the NoVNC URL
				await fetchBookingDetails();
			}
		} catch (error) {
			console.error('Error starting access:', error);
			setError(error.response?.data?.message || 'Failed to start rack access');
		} finally {
			setStartingAccess(false);
		}
	};

	const handleOpenVNC = () => {
		if (booking?.vncAccess?.novncUrl) {
			// Open NoVNC in a new window with a unique session ID
			const sessionId = `${bookingId}-${Date.now()}`;
			router.push(`/vnc-viewer?session=${sessionId}&booking=${bookingId}`);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (error && !booking) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-red-600 mb-4">{error}</p>
					<button
						onClick={() => router.push('/dashboard')}
						className="text-indigo-600 hover:text-indigo-500"
					>
						← Back to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-6">
					<button
						onClick={() => router.push('/dashboard')}
						className="text-indigo-600 hover:text-indigo-500 mb-4"
					>
						← Back to Dashboard
					</button>
					<h1 className="text-3xl font-bold text-gray-900">
						{booking?.rack?.name || 'Rack Access'}
					</h1>
				</div>

				{/* Booking Info Card */}
				<div className="bg-white shadow rounded-lg p-6 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-sm font-medium text-gray-500">Booking Details</h3>
							<div className="mt-2 space-y-2">
								<p className="text-sm">
									<span className="font-medium">User:</span>{' '}
									{booking?.user?.firstName} {booking?.user?.lastName}
								</p>
								<p className="text-sm">
									<span className="font-medium">Email:</span> {booking?.user?.email}
								</p>
								<p className="text-sm">
									<span className="font-medium">Start Time:</span>{' '}
									{new Date(booking?.startTime).toLocaleString()}
								</p>
								<p className="text-sm">
									<span className="font-medium">End Time:</span>{' '}
									{new Date(booking?.endTime).toLocaleString()}
								</p>
								{booking?.selectedAciVersion && (
									<p className="text-sm">
										<span className="font-medium">ACI Version:</span>{' '}
										{booking.selectedAciVersion}
									</p>
								)}
							</div>
						</div>
						<div>
							<h3 className="text-sm font-medium text-gray-500">Time Remaining</h3>
							<div className="mt-2">
								<p className="text-4xl font-bold text-indigo-600">{timeRemaining}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<p className="text-red-800">{error}</p>
					</div>
				)}

				{/* Access Control */}
				<div className="bg-white shadow rounded-lg p-6 mb-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">Rack Access Control</h3>
					{!booking?.vncAccess?.isActive ? (
						<button
							onClick={handleStartAccess}
							disabled={startingAccess}
							className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${
								startingAccess
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-green-600 text-white hover:bg-green-500'
							}`}
						>
							{startingAccess ? 'Starting Access...' : 'Start Access'}
						</button>
					) : (
						<div className="space-y-4">
							<p className="text-green-600 font-medium">✓ Access is active</p>
							<p className="text-sm text-gray-600">
								Your VNC connection is ready. Click on the topology diagram below to access
								the rack components.
							</p>
						</div>
					)}
				</div>

				{/* Topology Diagram */}
				{booking?.rack?.topologyDiagram && (
					<div className="bg-white shadow rounded-lg p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Rack Topology Diagram
						</h3>
						<div className="relative">
							<img
								src={`${process.env.NEXT_PUBLIC_API_STATIC_URL || 'https://localhost:5443'}${
									booking.rack.topologyDiagram
								}`}
								alt="Topology Diagram"
								useMap="#topology-map"
								className={`max-w-full h-auto ${
									booking?.vncAccess?.isActive
										? 'cursor-pointer'
										: 'opacity-50 cursor-not-allowed'
								}`}
							/>
							{booking?.rack?.topologyHtmlMap && booking?.vncAccess?.isActive && (
								<div
									dangerouslySetInnerHTML={{
										__html: booking.rack.topologyHtmlMap.replace(
											/href="[^"]*"/g,
											`onclick="window.parent.postMessage({type:'openVNC', bookingId:'${bookingId}'}, '*'); return false;" href="#"`
										),
									}}
								/>
							)}
						</div>
						{!booking?.vncAccess?.isActive && (
							<p className="mt-4 text-center text-gray-500 text-sm">
								Start access to enable the interactive topology diagram
							</p>
						)}
					</div>
				)}
			</div>

			{/* Listen for postMessage from topology map clicks */}
			{booking?.vncAccess?.isActive && (
				<script
					dangerouslySetInnerHTML={{
						__html: `
							window.addEventListener('message', function(event) {
								if (event.data.type === 'openVNC') {
									window.location.href = '/vnc-viewer?session=' + Date.now() + '&booking=' + event.data.bookingId;
								}
							});
						`,
					}}
				/>
			)}
		</div>
	);
}
