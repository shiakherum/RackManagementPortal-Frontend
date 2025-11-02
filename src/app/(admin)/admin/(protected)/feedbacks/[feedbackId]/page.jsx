'use client';

import api from '@/lib/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeedbackDetailPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const params = useParams();
	const { feedbackId } = params;

	const [feedback, setFeedback] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (feedbackId && session?.accessToken) {
			fetchFeedback();
		}
	}, [feedbackId, session?.accessToken]);

	const fetchFeedback = async () => {
		if (!session?.accessToken) return;

		try {
			setLoading(true);
			const response = await api.get(`/feedbacks/admin/${feedbackId}`, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			setFeedback(response.data.data);
		} catch (error) {
			console.error('Error fetching feedback:', error);
			if (error.response?.status !== 401) {
				alert('Failed to load feedback details');
			}
			router.push('/admin/feedbacks');
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZoneName: 'short',
		});
	};

	const StarRatingDisplay = ({ rating, label }) => {
		return (
			<div className="space-y-2">
				<div className="text-sm font-medium text-gray-700">{label}</div>
				<div className="flex items-center gap-2">
					<div className="flex gap-1">
						{[...Array(5)].map((_, i) => (
							<StarIcon
								key={i}
								className={`h-6 w-6 ${
									i < rating ? 'text-yellow-400' : 'text-gray-300'
								}`}
							/>
						))}
					</div>
					<span className="text-lg font-semibold text-gray-900">{rating}/5</span>
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="p-6">
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
				</div>
			</div>
		);
	}

	if (!feedback) {
		return null;
	}

	return (
		<div className="p-6">
			{/* Header */}
			<div className="mb-8">
				<button
					onClick={() => router.push('/admin/feedbacks')}
					className="text-indigo-600 hover:text-indigo-900 font-medium mb-4 inline-flex items-center"
				>
					← Back to Feedbacks
				</button>
				<h1 className="text-3xl font-bold text-gray-900">Feedback Details</h1>
				<p className="mt-2 text-gray-600">
					Submitted on {formatDate(feedback.createdAt)}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* User & Booking Info */}
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">User & Booking Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<div className="text-sm font-medium text-gray-500 mb-1">User</div>
								<div className="text-base font-semibold text-gray-900">
									{feedback.user?.firstName} {feedback.user?.lastName}
								</div>
								<div className="text-sm text-gray-600">{feedback.user?.email}</div>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-500 mb-1">Rack</div>
								<div className="text-base font-semibold text-gray-900">{feedback.rack?.name}</div>
								<div className="text-sm text-gray-600">Device ID: {feedback.rack?.deviceId}</div>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-500 mb-1">Booking Period</div>
								<div className="text-sm text-gray-900">
									{new Date(feedback.booking?.startTime).toLocaleString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: 'numeric',
										minute: '2-digit'
									})}
									{' → '}
									{new Date(feedback.booking?.endTime).toLocaleString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: 'numeric',
										minute: '2-digit'
									})}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-500 mb-1">ACI Version</div>
								<div className="text-base font-semibold text-gray-900">
									{feedback.booking?.selectedAciVersion || 'N/A'}
								</div>
							</div>
						</div>
					</div>

					{/* Text Responses */}
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Responses</h2>
						<div className="space-y-6">
							{feedback.whatDidYouLike && (
								<div>
									<div className="text-sm font-medium text-gray-700 mb-2">
										What did they like most?
									</div>
									<div className="bg-gray-50 rounded-lg p-4 text-gray-900">
										{feedback.whatDidYouLike}
									</div>
								</div>
							)}

							{feedback.whatCanBeImproved && (
								<div>
									<div className="text-sm font-medium text-gray-700 mb-2">
										What can be improved?
									</div>
									<div className="bg-yellow-50 rounded-lg p-4 text-gray-900 border border-yellow-200">
										{feedback.whatCanBeImproved}
									</div>
								</div>
							)}

							{feedback.additionalComments && (
								<div>
									<div className="text-sm font-medium text-gray-700 mb-2">
										Additional Comments
									</div>
									<div className="bg-blue-50 rounded-lg p-4 text-gray-900 border border-blue-200">
										{feedback.additionalComments}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar - Ratings */}
				<div className="lg:col-span-1 space-y-6">
					{/* Overall Rating Card */}
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow rounded-lg p-6 border-2 border-yellow-300">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h2>
						<div className="flex flex-col items-center">
							<div className="text-6xl font-bold text-yellow-600 mb-2">
								{feedback.overallRating}
							</div>
							<div className="flex gap-1 mb-2">
								{[...Array(5)].map((_, i) => (
									<StarIcon
										key={i}
										className={`h-8 w-8 ${
											i < feedback.overallRating ? 'text-yellow-400' : 'text-yellow-200'
										}`}
									/>
								))}
							</div>
							<div className="text-sm text-gray-600">out of 5 stars</div>
						</div>
					</div>

					{/* Recommendation */}
					<div className={`shadow rounded-lg p-6 border-2 ${
						feedback.wouldRecommend
							? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
							: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
					}`}>
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h2>
						<div className="text-center">
							<div className={`text-4xl font-bold ${
								feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'
							}`}>
								{feedback.wouldRecommend ? '✓ YES' : '✗ NO'}
							</div>
							<div className="text-sm text-gray-600 mt-2">
								{feedback.wouldRecommend
									? 'Would recommend to others'
									: 'Would not recommend'}
							</div>
						</div>
					</div>

					{/* Detailed Ratings */}
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Ratings</h2>
						<div className="space-y-4">
							<StarRatingDisplay rating={feedback.hardwareQuality} label="Hardware Quality" />
							<StarRatingDisplay rating={feedback.connectionStability} label="Connection Stability" />
							<StarRatingDisplay rating={feedback.easeOfUse} label="Ease of Use" />
							<StarRatingDisplay rating={feedback.valueForMoney} label="Value for Money" />
						</div>
					</div>

					{/* Average of Category Ratings */}
					<div className="bg-indigo-50 shadow rounded-lg p-6 border border-indigo-200">
						<h3 className="text-sm font-semibold text-gray-900 mb-2">Category Average</h3>
						<div className="text-3xl font-bold text-indigo-600">
							{((feedback.hardwareQuality + feedback.connectionStability + feedback.easeOfUse + feedback.valueForMoney) / 4).toFixed(1)}
						</div>
						<div className="text-xs text-gray-600 mt-1">Average across all categories</div>
					</div>
				</div>
			</div>
		</div>
	);
}
