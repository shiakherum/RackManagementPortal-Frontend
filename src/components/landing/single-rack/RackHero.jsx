'use client';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import {
	ChevronRightIcon,
	ClockIcon,
	CpuChipIcon,
	HomeIcon,
	ServerStackIcon,
} from '@heroicons/react/24/outline';
import {
	CheckCircleIcon as CheckCircleSolid,
	ClockIcon as ClockSolid,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect } from 'react';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// Get available dates (next 7 days)
const getAvailableDates = () => {
	const dates = [];
	const today = new Date();
	for (let i = 0; i < 7; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);
		dates.push({
			date: date.toISOString().split('T')[0],
			day: date.getDate(),
			weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
			isToday: i === 0,
		});
	}
	return dates;
};

// Get user's timezone
const getUserTimezone = () => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Format time for display with timezone
const formatTimeWithTimezone = (date) => {
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short',
	});
};

// Get current time rounded to next 5 minutes in local timezone format for datetime-local input
const getRoundedCurrentTimeLocal = () => {
	const now = new Date();
	const minutes = now.getMinutes();
	const roundedMinutes = Math.ceil(minutes / 5) * 5;
	now.setMinutes(roundedMinutes);
	now.setSeconds(0);
	now.setMilliseconds(0);

	// Convert to local datetime string format (YYYY-MM-DDTHH:mm)
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const mins = String(now.getMinutes()).padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${mins}`;
};

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function RackHero({ rack }) {
	const { user, isAuthenticated } = useStudentAuth();
	const router = useRouter();
	const [bookingInProgress, setBookingInProgress] = useState(false);
	const [rackBookings, setRackBookings] = useState([]);

	// Process rack data with fallbacks for static pages
	const rackData = rack ? {
		id: rack.deviceId,
		title: rack.name,
		tagline: rack.titleFeature || 'Enterprise ACI Rack',
		description: rack.description || 'Professional ACI rack available for booking.',
		status: 'available',
		nextAvailable: null,
		tokenRate: rack.tokenCostPerHour || 0,
		hardware: {
			total: rack.specifications?.length || 0,
		},
		availableAciVersions: rack.availableAciVersions?.length > 0 ? rack.availableAciVersions : ['6.0(2h)'],
		location: 'Data Center',
		lastWiped: '2 hours ago',
		features: rack.featuresList?.length > 0 ? rack.featuresList : [
			'Professional support included',
			'24/7 availability',
			'Secure access',
			'Regular maintenance'
		],
	} : {
		// Fallback data for static pages
		id: 'single-pod',
		title: 'Single Pod',
		tagline: '2 Leafs · 1 Spine · 1 APIC',
		description: 'Perfect for CCNP study, foundational ACI labs, and quick proof-of-concepts. This single-pod rack pairs two enterprise Leaf switches with a Spine and full APIC, mirroring a production fabric—L3-Out connectivity included.',
		status: 'available',
		nextAvailable: null,
		tokenRate: 25,
		hardware: {
			total: 4,
		},
		availableAciVersions: ['5.2(1g)', '6.0(2h)', '6.0(3c)', '6.1(1a)'],
		location: 'Data Center A, Row 5',
		lastWiped: '2 hours ago',
		features: [
			'L3-Out (OSPF/BGP)',
			'VPN jump host included',
			'Console + GUI access',
			'One-click power cycle',
			'Multi-version ACI images (5.x & 6.x)',
			'Clean-wipe reset after each session',
			'Snapshot & instant revert support',
			'24×7 self-service booking calendar',
		],
	};

	const [selectedAciVersion, setSelectedAciVersion] = useState(
		rackData.availableAciVersions[0]
	);
	const [selectedStartTime, setSelectedStartTime] = useState('');
	const [selectedDuration, setSelectedDuration] = useState(1);
	const [userTimezone] = useState(getUserTimezone());

	// Initialize with current time rounded to next 5 minutes in user's local timezone
	useEffect(() => {
		const localDatetimeString = getRoundedCurrentTimeLocal();
		setSelectedStartTime(localDatetimeString);
	}, []);

	// Fetch rack availability when component mounts
	useEffect(() => {
		if (rack?._id) {
			fetchRackAvailability();
		}
	}, [rack?._id]);

	const fetchRackAvailability = async () => {
		try {
			// Get the date range for the next 7 days
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const endDate = new Date(today);
			endDate.setDate(today.getDate() + 7);
			endDate.setHours(23, 59, 59, 999);

			const response = await api.get(`/bookings/availability/${rack._id}`, {
				params: {
					start: today.toISOString(),
					end: endDate.toISOString()
				}
			});
			if (response.data.success) {
				setRackBookings(response.data.data || []);
			}
		} catch (error) {
			console.error('Error fetching rack availability:', error);
		}
	};

	const getStatusDisplay = () => {
		switch (rackData.status) {
			case 'available':
				return {
					icon: CheckCircleSolid,
					text: 'Available now',
					color: 'text-emerald-600',
					bgColor: 'bg-emerald-50',
					ringColor: 'ring-emerald-200',
				};
			case 'busy':
				return {
					icon: ClockSolid,
					text: 'Next slot: 15:30 IST',
					color: 'text-amber-600',
					bgColor: 'bg-amber-50',
					ringColor: 'ring-amber-200',
				};
			case 'maintenance':
				return {
					icon: ClockSolid,
					text: 'Under maintenance',
					color: 'text-gray-500',
					bgColor: 'bg-gray-50',
					ringColor: 'ring-gray-200',
				};
			default:
				return {
					icon: ClockIcon,
					text: 'Checking...',
					color: 'text-gray-500',
					bgColor: 'bg-gray-50',
					ringColor: 'ring-gray-200',
				};
		}
	};

	// Check if selected time conflicts with existing bookings
	const hasTimeConflict = () => {
		if (!selectedStartTime) return false;

		const requestedStart = new Date(selectedStartTime);
		const requestedEnd = new Date(requestedStart);
		requestedEnd.setHours(requestedStart.getHours() + selectedDuration);

		return rackBookings.some((booking) => {
			const bookingStart = new Date(booking.startTime);
			const bookingEnd = new Date(booking.endTime);

			// Check if there's any overlap
			return (
				(requestedStart >= bookingStart && requestedStart < bookingEnd) ||
				(requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
				(requestedStart <= bookingStart && requestedEnd >= bookingEnd)
			);
		});
	};

	// Get minimum datetime string for the input (current time in local timezone)
	const getMinDateTime = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const mins = String(now.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${mins}`;
	};

	const status = getStatusDisplay();
	const StatusIcon = status.icon;

	const handleBooking = async () => {
		if (!isAuthenticated) {
			router.push('/signin');
			return;
		}

		if (!selectedStartTime) {
			alert('Please select a start time for your booking.');
			return;
		}

		// Check for time conflicts
		if (hasTimeConflict()) {
			alert('The selected time conflicts with an existing booking. Please choose a different time.');
			return;
		}

		// Check if start time is in the past
		const startDateTime = new Date(selectedStartTime);
		if (startDateTime < new Date()) {
			alert('Start time must be in the future. Please select a valid time.');
			return;
		}

		// Check if user has enough tokens
		const totalCost = rackData.tokenRate * selectedDuration;
		if (user.tokens < totalCost) {
			alert(`Insufficient tokens. You need ${totalCost} tokens but only have ${user.tokens} tokens.`);
			return;
		}

		setBookingInProgress(true);
		try {
			const endDateTime = new Date(startDateTime);
			endDateTime.setHours(startDateTime.getHours() + selectedDuration);

			const bookingData = {
				rackId: rack._id,
				selectedAciVersion: selectedAciVersion,
				startTime: startDateTime.toISOString(),
				endTime: endDateTime.toISOString(),
				selectedPreConfigs: [],
			};

			const response = await api.post('/bookings', bookingData);

			if (response.data.success) {
				alert(`Booking created successfully! Start time: ${formatTimeWithTimezone(startDateTime)} (Your timezone: ${userTimezone})`);
				router.push('/dashboard');
			} else {
				alert('Failed to create booking. Please try again.');
			}
		} catch (error) {
			console.error('Booking error:', error);
			alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
		} finally {
			setBookingInProgress(false);
		}
	};

	return (
		<div className='bg-gray-100'>
			<div className='relative isolate overflow-hidden'>
				{/* Background gradients */}
				<div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
					/>
				</div>

				<div className='mx-auto max-w-7xl px-6 py-16 sm:py-16 sm:pb-20 lg:px-8'>
					{/* Breadcrumb */}
					<nav className='flex mb-10'>
						<ol role='list' className='flex items-center space-x-4'>
							<li>
								<div>
									<a href='#' className='text-gray-400 hover:text-gray-500'>
										<HomeIcon aria-hidden='true' className='size-5 shrink-0' />
										<span className='sr-only'>Home</span>
									</a>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<ChevronRightIcon
										aria-hidden='true'
										className='size-5 shrink-0 text-gray-400'
									/>
									<a
										href='#'
										className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
										Racks
									</a>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<ChevronRightIcon
										aria-hidden='true'
										className='size-5 shrink-0 text-gray-400'
									/>
									<a
										href='#'
										className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
										{rackData.title}
									</a>
								</div>
							</li>
						</ol>
					</nav>

					<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
						{/* Left column - Main content */}
						<div className='lg:col-span-7'>
							{/* Rack title & status */}
							<div className='flex items-start justify-between mb-6'>
								<div>
									<div className='flex items-start gap-3 mb-2'>
										<div className='flex h-12 w-12 mt-1.5 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600'>
											<ServerStackIcon className='h-6 w-6 text-white' />
										</div>
										<div>
											<h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-1'>
												{rackData.title}
											</h1>
											<p className='text-lg text-gray-600'>
												{rackData.tagline}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Description with Markdown */}
							<div className='mt-6 max-w-2xl prose prose-gray prose-sm mb-8'>
								<ReactMarkdown>{rackData.description}</ReactMarkdown>
							</div>

							{/* Rack Topology Diagram */}
							{rack?.topologyDiagram && (
								<div className='mb-8'>
									<h3 className='text-base font-semibold text-gray-900 mb-3'>
										Rack Topology Diagram
									</h3>
									<div className='overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200'>
										<img
											src={rack.topologyDiagram}
											alt={`${rackData.title} Topology Diagram`}
											className='w-full h-auto object-contain'
										/>
									</div>
								</div>
							)}

							{/* Quick specs - using cleaner card style */}
							<div className='mb-8'>
								<h3 className='text-base font-semibold text-gray-900 mb-3'>
									Rack Specifications
								</h3>

								<div>
									{rack?.specifications && rack.specifications.length > 0 ? (
										<dl className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
											{rack.specifications.slice(0, 3).map((spec, index) => (
												<div key={index} className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm'>
													<dt className='truncate text-sm font-medium text-gray-500'>
														{spec.specName}
													</dt>
													<dd className='mt-1 text-xl font-semibold tracking-tight text-gray-900'>
														{spec.specValue}
													</dd>
												</div>
											))}
										</dl>
									) : (
										<dl className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
											<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm'>
												<dt className='truncate text-sm font-medium text-gray-500'>
													Total Hardware
												</dt>
												<dd className='mt-1 text-xl font-semibold tracking-tight text-gray-900'>
													{rackData.hardware.total} Nodes
												</dd>
											</div>
											<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm'>
												<dt className='truncate text-sm font-medium text-gray-500'>
													Location
												</dt>
												<dd className='mt-1 text-xl font-semibold tracking-tight text-gray-900'>
													{rackData.location}
												</dd>
											</div>
											<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm'>
												<dt className='truncate text-sm font-medium text-gray-500'>
													Status
												</dt>
												<dd className='mt-1 text-xl font-semibold tracking-tight text-gray-900'>
													Available
												</dd>
											</div>
										</dl>
									)}
								</div>
							</div>

							{/* ACI Version Selector */}
							<div className='mb-8'>
								<h3 className='text-base font-semibold text-gray-900 mb-3'>
									Select ACI Version
								</h3>
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
									{rackData.availableAciVersions.map((version) => (
										<button
											key={version}
											onClick={() => setSelectedAciVersion(version)}
											className={`relative rounded-lg cursor-pointer p-4 text-left transition-all ${
												selectedAciVersion === version
													? 'border-indigo-600 bg-indigo-50 border ring-1 ring-indigo-600'
													: 'border-gray-300 border bg-white hover:border-gray-300'
											}`}>
											<div className='flex items-center justify-between'>
												<span
													className={`text-sm font-medium ${
														selectedAciVersion === version
															? 'text-indigo-900'
															: 'text-gray-900'
													}`}>
													{version}
												</span>
												{selectedAciVersion === version && (
													<CheckCircleIcon className='h-4 w-4 text-indigo-600' />
												)}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Features list */}
							<div className='mb-8 mt-10'>
								<h3 className='text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide'>
									Included Features
								</h3>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
									{rackData.features.map((feature, index) => (
										<div key={index} className='flex items-center gap-2'>
											<CheckCircleIcon className='h-4 w-4 text-indigo-500 flex-shrink-0' />
											<span className='text-sm text-gray-700'>{feature}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right column - Booking card */}
						<div className='lg:col-span-5'>
							<div className='sticky top-8'>
								<div className='rounded-2xl border shadow-xs border-gray-200 bg-white p-6'>
									{/* Pricing */}
									<div className='text-center mb-6 pb-6 border-b border-gray-200'>
										<div className='flex items-baseline justify-center gap-2'>
											<span className='text-4xl font-bold tracking-tight text-gray-900'>
												<span className='opacity-35'>T</span>
												{rackData.tokenRate}
											</span>
											<span className='text-lg font-medium text-gray-600'>
												/hour
											</span>
										</div>
										<p className='text-sm text-gray-500 mt-1'>
											≈{' '}
											<strong className='font-medium text-indigo-700'>
												₹{(rackData.tokenRate * 4).toFixed(2)}
											</strong>{' '}
											per hour
										</p>
									</div>

									{/* Selected ACI version display */}
									<div className='mb-6'>
										<div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
											<CpuChipIcon className='h-4 w-4' />
											Selected ACI Version
										</div>
										<div className='bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2'>
											<span className='text-lg font-semibold text-indigo-900'>
												{selectedAciVersion}
											</span>
										</div>
									</div>

									{/* Start Time Selection */}
									<div className='mb-6'>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>
											Select Start Time
										</h4>
										<div className='space-y-2'>
											<input
												type="datetime-local"
												value={selectedStartTime}
												onChange={(e) => setSelectedStartTime(e.target.value)}
												min={getMinDateTime()}
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-900'
											/>
											<div className='flex items-center gap-2 text-xs text-gray-500'>
												<ClockIcon className='h-4 w-4' />
												<span>Your timezone: {userTimezone}</span>
											</div>
											{hasTimeConflict() && (
												<div className='text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2'>
													⚠ This time conflicts with an existing booking. Please choose a different time.
												</div>
											)}
										</div>
									</div>

									{/* Currently Booked Times */}
									{rackBookings.length > 0 && (
										<div className='mb-6'>
											<h4 className='text-sm font-medium text-gray-900 mb-3'>
												Currently Booked Times
											</h4>
											<div className='max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50'>
												{rackBookings.map((booking, index) => {
													const start = new Date(booking.startTime);
													const end = new Date(booking.endTime);
													const duration = Math.abs(end - start) / 36e5; // hours
													return (
														<div key={index} className='flex items-center justify-between text-xs bg-white border border-red-200 rounded px-3 py-2'>
															<div className='flex items-center gap-2'>
																<div className='w-2 h-2 bg-red-500 rounded-full'></div>
																<span className='text-gray-700'>
																	{start.toLocaleString('en-US', {
																		month: 'short',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: '2-digit',
																		timeZoneName: 'short'
																	})}
																</span>
															</div>
															<span className='text-gray-500'>
																{duration}h
															</span>
														</div>
													);
												})}
											</div>
											<div className='text-xs text-gray-500 mt-2'>
												Showing all confirmed bookings in the next 7 days
											</div>
										</div>
									)}

									{/* Duration selector */}
									<div className='mb-6'>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>
											Duration (Hours)
										</h4>
										<div className='flex gap-px bg-gray-200 shadow-xs ring-1 ring-gray-200 rounded-md overflow-hidden'>
											{[1, 2, 3, 4, 6, 8].map((hours) => (
												<button
													key={hours}
													onClick={() => setSelectedDuration(hours)}
													className={classNames(
														'px-3 py-2 text-sm font-semibold transition-all flex-1',
														selectedDuration === hours
															? 'bg-indigo-600 text-white'
															: 'bg-white text-gray-700 hover:bg-gray-50'
													)}>
													{hours}h
												</button>
											))}
										</div>
									</div>

									{/* Token balance */}
									<div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
										<div className='flex items-center justify-between'>
											<div className='text-sm font-medium text-gray-900'>
												Token Balance
											</div>
											{isAuthenticated ? (
												<div className='text-2xl font-bold text-indigo-600'>
													<span className='opacity-35'>T</span>{user.tokens}
												</div>
											) : (
												<div className='text-xs text-indigo-600 hover:text-indigo-500 cursor-pointer' onClick={() => router.push('/signin')}>
													Login to see balance
												</div>
											)}
										</div>
										{!isAuthenticated && (
											<div className='text-xs text-gray-500 mt-1'>
												Sign in to view your available tokens and booking capacity
											</div>
										)}
									</div>

									{/* Selection summary */}
									{selectedStartTime && !hasTimeConflict() && (
										<div className='mb-6 p-3 bg-green-50 border border-green-200 rounded-lg'>
											<div className='text-sm font-medium text-green-900'>
												Booking Summary
											</div>
											<div className='text-sm text-green-700 mt-1'>
												{formatTimeWithTimezone(new Date(selectedStartTime))} • {selectedDuration}{' '}
												hour{selectedDuration > 1 ? 's' : ''}
											</div>
											<div className='text-xs text-green-600 mt-1'>
												Total cost: T{rackData.tokenRate * selectedDuration}
											</div>
										</div>
									)}

									{/* Book button */}
									<button
											onClick={handleBooking}
										disabled={!isAuthenticated || !selectedStartTime || hasTimeConflict() || bookingInProgress}
										className={classNames(
											'w-full rounded-lg px-4 py-3 text-base font-semibold shadow-sm transition-all',
											!isAuthenticated || !selectedStartTime || hasTimeConflict() || bookingInProgress
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
										)}>
										{bookingInProgress ? 'Creating Booking...' : !isAuthenticated
											? 'Login Required to Book'
											: !selectedStartTime
											? 'Select Start Time to Book'
											: hasTimeConflict()
											? 'Time Conflict - Choose Another Time'
											: 'Book This Rack'}
									</button>

									{/* Login prompt */}
									{!isAuthenticated && (
										<div className='mt-4 text-center'>
											<button onClick={() => router.push('/signin')} className='text-sm cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium'>
												Sign in to your account
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom gradient */}
				<div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
					/>
				</div>
			</div>
		</div>
	);
}
