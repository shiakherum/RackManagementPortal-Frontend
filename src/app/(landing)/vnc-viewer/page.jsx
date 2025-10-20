'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function VNCViewerContent() {
	const { isAuthenticated, loading: authLoading } = useStudentAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const bookingId = searchParams.get('bookingId');
	const sessionId = searchParams.get('session');

	const [vncUrl, setVncUrl] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated && bookingId) {
			fetchVNCUrl();
		} else if (isAuthenticated && !bookingId) {
			setError('No booking specified');
			setLoading(false);
		}
	}, [isAuthenticated, authLoading, bookingId]);

	const fetchVNCUrl = async () => {
		try {
			const response = await api.get(`/rack-access/${bookingId}`);
			const booking = response.data.data;

			if (!booking.vncAccess?.isActive || !booking.vncAccess?.novncUrl) {
				setError('VNC access is not active for this booking');
				setLoading(false);
				return;
			}

			// Verify booking is still valid
			const now = new Date();
			const endTime = new Date(booking.endTime);
			if (now > endTime) {
				setError('Booking has expired');
				setLoading(false);
				return;
			}

			setVncUrl(booking.vncAccess.novncUrl);
		} catch (error) {
			console.error('Error fetching VNC URL:', error);
			setError(error.response?.data?.message || 'Failed to load VNC connection');
		} finally {
			setLoading(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
					<p className="text-white">Loading VNC connection...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="text-center">
					<p className="text-red-400 mb-4">{error}</p>
					<button
						onClick={() => router.push(`/rack-access/${bookingId}`)}
						className="text-indigo-400 hover:text-indigo-300"
					>
						← Back to Rack Access
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-screen bg-gray-900 flex flex-col">
			{/* Header */}
			<div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => router.push(`/rack-access/${bookingId}`)}
						className="text-gray-300 hover:text-white text-sm"
					>
						← Back
					</button>
					<span className="text-gray-400 text-sm">Session: {sessionId}</span>
				</div>
				<div className="flex items-center space-x-2">
					<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
					<span className="text-green-400 text-sm">Connected</span>
				</div>
			</div>

			{/* VNC Iframe */}
			<div className="flex-1 relative">
				<iframe
					src={vncUrl}
					className="absolute inset-0 w-full h-full border-0"
					allow="clipboard-read; clipboard-write"
					title="VNC Viewer"
				/>
			</div>
		</div>
	);
}

export default function VNCViewerPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gray-900">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
				</div>
			}
		>
			<VNCViewerContent />
		</Suspense>
	);
}
