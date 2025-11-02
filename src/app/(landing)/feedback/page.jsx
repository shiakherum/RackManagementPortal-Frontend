'use client';

import api from '@/lib/api';
import { useStudentAuth } from '@/lib/student-auth';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function StarRating({ rating, setRating, label }) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-900">{label}</label>
			<div className="flex gap-2">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => setRating(star)}
						className="focus:outline-none transition-transform hover:scale-110"
					>
						{star <= rating ? (
							<StarIcon className="h-10 w-10 text-yellow-400" />
						) : (
							<StarOutline className="h-10 w-10 text-gray-300" />
						)}
					</button>
				))}
			</div>
		</div>
	);
}

function FeedbackFormContent() {
	const { user, isAuthenticated, loading: authLoading } = useStudentAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const bookingId = searchParams.get('bookingId');

	const [booking, setBooking] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	// Star ratings
	const [overallRating, setOverallRating] = useState(0);
	const [hardwareQuality, setHardwareQuality] = useState(0);
	const [connectionStability, setConnectionStability] = useState(0);
	const [easeOfUse, setEaseOfUse] = useState(0);
	const [valueForMoney, setValueForMoney] = useState(0);

	// Text responses
	const [whatDidYouLike, setWhatDidYouLike] = useState('');
	const [whatCanBeImproved, setWhatCanBeImproved] = useState('');
	const [wouldRecommend, setWouldRecommend] = useState(null);
	const [additionalComments, setAdditionalComments] = useState('');

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		} else if (isAuthenticated && bookingId) {
			fetchBooking();
		} else if (isAuthenticated && !bookingId) {
			setError('No booking specified');
			setLoading(false);
		}
	}, [isAuthenticated, authLoading, bookingId]);

	const fetchBooking = async () => {
		try {
			const response = await api.get(`/bookings`);
			const bookings = response.data.data;
			const targetBooking = bookings.find(b => b._id === bookingId);

			if (!targetBooking) {
				setError('Booking not found');
				setLoading(false);
				return;
			}

			if (targetBooking.status !== 'completed') {
				setError('Feedback can only be submitted for completed bookings');
				setLoading(false);
				return;
			}

			// Check if feedback already exists
			const feedbackCheck = await api.get(`/feedbacks/booking/${bookingId}`);
			if (feedbackCheck.data.data) {
				setError('You have already submitted feedback for this booking');
				setLoading(false);
				return;
			}

			setBooking(targetBooking);
		} catch (error) {
			if (error.response?.status === 404) {
				// No feedback yet, that's fine
				// Try to get booking details
				try {
					const response = await api.get(`/bookings`);
					const bookings = response.data.data;
					const targetBooking = bookings.find(b => b._id === bookingId);
					if (targetBooking) {
						setBooking(targetBooking);
					}
				} catch (err) {
					console.error('Error fetching booking:', err);
					setError('Failed to load booking details');
				}
			} else {
				console.error('Error checking feedback:', error);
				setError(error.response?.data?.message || 'Failed to load feedback status');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!overallRating || !hardwareQuality || !connectionStability || !easeOfUse || !valueForMoney) {
			alert('Please rate all categories with stars');
			return;
		}

		if (wouldRecommend === null) {
			alert('Please indicate if you would recommend our service');
			return;
		}

		setSubmitting(true);
		try {
			const feedbackData = {
				bookingId,
				overallRating,
				hardwareQuality,
				connectionStability,
				easeOfUse,
				valueForMoney,
				whatDidYouLike: whatDidYouLike.trim(),
				whatCanBeImproved: whatCanBeImproved.trim(),
				wouldRecommend,
				additionalComments: additionalComments.trim(),
			};

			await api.post('/feedbacks', feedbackData);
			alert('Thank you for your feedback! Your input helps us improve our service.');
			router.push('/dashboard');
		} catch (error) {
			console.error('Error submitting feedback:', error);
			alert(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
					<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
						<span className="text-red-600 text-xl">!</span>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Submit Feedback</h3>
					<p className="text-sm text-gray-500 mb-6">{error}</p>
					<button
						onClick={() => router.push('/dashboard')}
						className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						Back to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
					<p className="text-lg text-gray-600">
						We'd love to hear about your experience with {booking?.rack?.name}
					</p>
				</div>

				{/* Booking Info Card */}
				<div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
					<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Booking Details</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium text-gray-700">Rack:</span>
							<span className="ml-2 text-gray-900">{booking?.rack?.name}</span>
						</div>
						<div>
							<span className="font-medium text-gray-700">Duration:</span>
							<span className="ml-2 text-gray-900">
								{booking && Math.abs(new Date(booking.endTime) - new Date(booking.startTime)) / 36e5} hours
							</span>
						</div>
					</div>
				</div>

				{/* Feedback Form */}
				<form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-8">
					{/* Star Ratings Section */}
					<div className="space-y-6">
						<h3 className="text-xl font-semibold text-gray-900 border-b pb-3">Rate Your Experience</h3>

						<StarRating
							rating={overallRating}
							setRating={setOverallRating}
							label="Overall Experience"
						/>
						<StarRating
							rating={hardwareQuality}
							setRating={setHardwareQuality}
							label="Hardware Quality"
						/>
						<StarRating
							rating={connectionStability}
							setRating={setConnectionStability}
							label="Connection Stability"
						/>
						<StarRating
							rating={easeOfUse}
							setRating={setEaseOfUse}
							label="Ease of Use"
						/>
						<StarRating
							rating={valueForMoney}
							setRating={setValueForMoney}
							label="Value for Money"
						/>
					</div>

					{/* Text Questions */}
					<div className="space-y-6">
						<h3 className="text-xl font-semibold text-gray-900 border-b pb-3">Tell Us More</h3>

						<div>
							<label className="block text-sm font-medium text-gray-900 mb-2">
								What did you like most about the service?
							</label>
							<textarea
								value={whatDidYouLike}
								onChange={(e) => setWhatDidYouLike(e.target.value)}
								rows={3}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
								placeholder="Share what you enjoyed..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 mb-2">
								What can we improve?
							</label>
							<textarea
								value={whatCanBeImproved}
								onChange={(e) => setWhatCanBeImproved(e.target.value)}
								rows={3}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
								placeholder="Help us get better..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 mb-3">
								Would you recommend our service to others? *
							</label>
							<div className="flex gap-4">
								<button
									type="button"
									onClick={() => setWouldRecommend(true)}
									className={`flex-1 py-3 px-4 rounded-md border-2 font-medium transition-all ${
										wouldRecommend === true
											? 'border-green-500 bg-green-50 text-green-700'
											: 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
									}`}
								>
									Yes, I would recommend
								</button>
								<button
									type="button"
									onClick={() => setWouldRecommend(false)}
									className={`flex-1 py-3 px-4 rounded-md border-2 font-medium transition-all ${
										wouldRecommend === false
											? 'border-red-500 bg-red-50 text-red-700'
											: 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
									}`}
								>
									No, I wouldn't
								</button>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 mb-2">
								Additional Comments (Optional)
							</label>
							<textarea
								value={additionalComments}
								onChange={(e) => setAdditionalComments(e.target.value)}
								rows={4}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
								placeholder="Any other thoughts or suggestions..."
							/>
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex gap-4 pt-6">
						<button
							type="button"
							onClick={() => router.push('/dashboard')}
							className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
						>
							{submitting ? 'Submitting...' : 'Submit Feedback'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function FeedbackPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		}>
			<FeedbackFormContent />
		</Suspense>
	);
}
