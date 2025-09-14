'use client';

import { StudentAppSidebar } from '@/components/student/dashboard/student-app-sidebar';
import { StudentSiteHeader } from '@/components/student/dashboard/student-site-header';
import {
	SidebarInset,
	SidebarProvider,
} from '@/components/ui/sidebar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Server, Coins, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const fetchUserBookings = async () => {
	const token = localStorage.getItem('studentAccessToken');
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';
	
	if (!token) {
		throw new Error('No authentication token found');
	}
	
	const response = await fetch(`${apiUrl}/bookings`, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('API Error:', response.status, errorText);
		throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
	}

	const result = await response.json();
	return result.data || [];
};

const getStatusColor = (status) => {
	switch (status?.toLowerCase()) {
		case 'confirmed':
			return 'bg-green-100 text-green-800 border-green-200';
		case 'pending':
			return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		case 'cancelled':
			return 'bg-red-100 text-red-800 border-red-200';
		case 'completed':
			return 'bg-blue-100 text-blue-800 border-blue-200';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200';
	}
};

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const formatTime = (dateString) => {
	return new Date(dateString).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
};

const calculateDuration = (startTime, endTime) => {
	const start = new Date(startTime);
	const end = new Date(endTime);
	const durationMs = end - start;
	const hours = Math.floor(durationMs / (1000 * 60 * 60));
	const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
	return hours > 0 ? (minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`) : `${minutes}m`;
};

export function StudentBookings({ user }) {
	const {
		data: bookings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['userBookings'],
		queryFn: fetchUserBookings,
		onError: (error) => {
			toast.error('Failed to load bookings');
		},
	});

	return (
		<div className='[--header-height:calc(theme(spacing.14))]'>
			<SidebarProvider className='flex flex-col'>
				<StudentSiteHeader user={user} />
				<div className='flex flex-1'>
					<StudentAppSidebar user={user} />
					<SidebarInset>
						<div className='flex flex-1 flex-col gap-4 p-4 pt-6'>
							{/* Header */}
							<div className='mb-4'>
								<h2 className='text-2xl font-bold tracking-tight'>
									My Bookings
								</h2>
								<p className='text-muted-foreground'>
									View and manage all your rack bookings.
								</p>
							</div>

							{/* Stats Overview */}
							<div className='grid auto-rows-min gap-4 md:grid-cols-4 mb-6'>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Total Bookings
										</CardTitle>
										<Calendar className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>
											{bookings?.length || 0}
										</div>
										<p className='text-xs text-muted-foreground'>All time</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Active Bookings
										</CardTitle>
										<Clock className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>
											{bookings?.filter(b => b.status === 'confirmed').length || 0}
										</div>
										<p className='text-xs text-muted-foreground'>Currently active</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Completed
										</CardTitle>
										<Server className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>
											{bookings?.filter(b => b.status === 'completed').length || 0}
										</div>
										<p className='text-xs text-muted-foreground'>Sessions finished</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Tokens Spent
										</CardTitle>
										<Coins className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>
											{bookings?.reduce((total, booking) => total + (booking.tokenCost || 0), 0) || 0}
										</div>
										<p className='text-xs text-muted-foreground'>Total cost</p>
									</CardContent>
								</Card>
							</div>

							{/* Bookings Table */}
							<Card>
								<CardHeader>
									<CardTitle>Booking History</CardTitle>
									<CardDescription>
										Detailed view of all your rack bookings
									</CardDescription>
								</CardHeader>
								<CardContent>
									{isLoading ? (
										<div className='flex items-center justify-center py-16'>
											<LoadingSpinner />
										</div>
									) : error ? (
										<div className='flex items-center justify-center py-16 text-muted-foreground'>
											<div className='text-center'>
												<AlertCircle className='mx-auto h-12 w-12 text-red-500' />
												<h3 className='mt-2 text-sm font-medium'>
													Failed to load bookings
												</h3>
												<p className='mt-1 text-sm text-muted-foreground'>
													Please try refreshing the page.
												</p>
											</div>
										</div>
									) : !bookings || bookings.length === 0 ? (
										<div className='flex items-center justify-center py-16 text-muted-foreground'>
											<div className='text-center'>
												<Calendar className='mx-auto h-12 w-12 text-muted-foreground/50' />
												<h3 className='mt-2 text-sm font-medium'>
													No bookings found
												</h3>
												<p className='mt-1 text-sm text-muted-foreground'>
													You haven't made any bookings yet.
												</p>
											</div>
										</div>
									) : (
										<div className='rounded-md border'>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Rack</TableHead>
														<TableHead>Date</TableHead>
														<TableHead>Time</TableHead>
														<TableHead>Duration</TableHead>
														<TableHead>Status</TableHead>
														<TableHead>Cost</TableHead>
														<TableHead>Booked On</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{bookings.map((booking) => (
														<TableRow key={booking._id}>
															<TableCell className='font-medium'>
																<div className='flex items-center space-x-2'>
																	<Server className='h-4 w-4 text-indigo-600' />
																	<span>{booking.rack?.name || 'Unknown Rack'}</span>
																</div>
															</TableCell>
															<TableCell>
																{formatDate(booking.startTime)}
															</TableCell>
															<TableCell>
																<div className='flex items-center space-x-1'>
																	<Clock className='h-3 w-3 text-muted-foreground' />
																	<span>
																		{formatTime(booking.startTime)} - {formatTime(booking.endTime)}
																	</span>
																</div>
															</TableCell>
															<TableCell>
																{calculateDuration(booking.startTime, booking.endTime)}
															</TableCell>
															<TableCell>
																<Badge 
																	variant='secondary' 
																	className={getStatusColor(booking.status)}
																>
																	{booking.status || 'Unknown'}
																</Badge>
															</TableCell>
															<TableCell>
																<div className='flex items-center space-x-1'>
																	<Coins className='h-3 w-3 text-yellow-600' />
																	<span>{booking.tokenCost || 0}</span>
																</div>
															</TableCell>
															<TableCell className='text-muted-foreground'>
																{new Date(booking.createdAt).toLocaleDateString()}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
}