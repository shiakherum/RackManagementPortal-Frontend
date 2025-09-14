'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Clock, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import DynamicListInput from '@/components/admin/shared/DynamicListInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

// Booking edit form schema
const editBookingSchema = z.object({
	userId: z.string().min(1, 'User is required'),
	rackId: z.string().min(1, 'Rack is required'),
	startTime: z.string().min(1, 'Start time is required'),
	endTime: z.string().min(1, 'End time is required'),
	tokenCost: z.coerce.number().min(1, 'Token cost must be at least 1'),
	selectedAciVersion: z.string().optional(),
	selectedPreConfigs: z.array(z.string()).optional(),
	status: z.enum(['confirmed', 'completed', 'cancelled', 'provisioning']),
});

export default function EditBookingForm({ bookingId }) {
	const { data: session } = useSession();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');

	// Fetch booking details
	const {
		data: booking,
		isLoading: loadingBooking,
		error: bookingError,
	} = useQuery({
		queryKey: ['adminBooking', bookingId],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get(`/admin/bookings/${bookingId}`, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data;
		},
		enabled: !!session?.accessToken && !!bookingId,
	});

	// Fetch users
	const { data: users = [] } = useQuery({
		queryKey: ['adminUsers'],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get('/admin/users', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data || [];
		},
		enabled: !!session?.accessToken,
	});

	// Fetch racks
	const { data: racks = [] } = useQuery({
		queryKey: ['adminRacks'],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get('/racks', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data || [];
		},
		enabled: !!session?.accessToken,
	});

	// Form setup
	const form = useForm({
		resolver: zodResolver(editBookingSchema),
		defaultValues: {
			userId: '',
			rackId: '',
			startTime: '',
			endTime: '',
			tokenCost: 0,
			selectedAciVersion: '',
			selectedPreConfigs: [],
			status: 'confirmed',
		},
		mode: 'onChange',
	});

	// Update form when booking data is loaded
	React.useEffect(() => {
		if (booking) {
			const formatDateForInput = (dateString) => {
				const date = new Date(dateString);
				return date.toISOString().slice(0, 16);
			};

			form.reset({
				userId: booking.user?._id || '',
				rackId: booking.rack?._id || '',
				startTime: formatDateForInput(booking.startTime),
				endTime: formatDateForInput(booking.endTime),
				tokenCost: booking.tokenCost || 0,
				selectedAciVersion: booking.selectedAciVersion || '',
				selectedPreConfigs: booking.selectedPreConfigs || [],
				status: booking.status || 'confirmed',
			});
		}
	}, [booking, form]);

	// Log form values for debugging
	const formValues = form.watch();
	React.useEffect(() => {
		console.log('Form values:', formValues);
		console.log('Users loaded:', users.length);
		console.log('Racks loaded:', racks.length);
		console.log('Booking data:', booking);
	}, [formValues, users.length, racks.length, booking]);

	// Update booking mutation
	const updateBookingMutation = useMutation({
		mutationFn: async (data) => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			return api.put(`/admin/bookings/${bookingId}`, data, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['adminBookings']);
			queryClient.invalidateQueries(['adminBooking', bookingId]);
			router.push('/admin/bookings');
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || 'An unexpected error occurred.';
			setServerError(message);
		},
	});

	// Handle form submission
	const onSubmit = (data) => {
		setServerError('');
		// Convert date strings to ISO format
		const formattedData = {
			...data,
			startTime: new Date(data.startTime).toISOString(),
			endTime: new Date(data.endTime).toISOString(),
		};

		updateBookingMutation.mutate(formattedData);
	};

	// Calculate estimated duration when times change
	const startTime = form.watch('startTime');
	const endTime = form.watch('endTime');
	const estimatedDuration = React.useMemo(() => {
		if (startTime && endTime) {
			const start = new Date(startTime);
			const end = new Date(endTime);
			if (end > start) {
				const diffMs = end - start;
				const hours = Math.floor(diffMs / (1000 * 60 * 60));
				const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
				return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
			}
		}
		return null;
	}, [startTime, endTime]);

	// Get selected user's token balance and calculate impact
	const selectedUserId = form.watch('userId');
	const selectedUser = users.find((user) => user._id === selectedUserId);
	const selectedRackId = form.watch('rackId');
	const selectedRack = racks.find((rack) => rack._id === selectedRackId);
	const newTokenCost = form.watch('tokenCost');

	// Calculate token impact
	const tokenImpact = React.useMemo(() => {
		if (!booking || !selectedUser || !newTokenCost) return null;

		const originalCost = booking.tokenCost;
		const originalUserId = booking.user?._id;
		const newUserId = selectedUserId;

		if (originalUserId === newUserId) {
			// Same user
			const difference = newTokenCost - originalCost;
			if (difference === 0)
				return { type: 'no-change', message: 'No token change' };
			if (difference > 0) {
				return {
					type: difference > selectedUser.tokens ? 'insufficient' : 'deduct',
					message: `${difference} additional tokens will be deducted`,
					sufficient: difference <= selectedUser.tokens,
				};
			} else {
				return {
					type: 'refund',
					message: `${Math.abs(difference)} tokens will be refunded`,
				};
			}
		} else {
			// Different user
			return {
				type: newTokenCost > selectedUser.tokens ? 'insufficient' : 'transfer',
				message: `${originalCost} tokens refunded to original user, ${newTokenCost} tokens deducted from new user`,
				sufficient: newTokenCost <= selectedUser.tokens,
			};
		}
	}, [booking, selectedUser, selectedUserId, newTokenCost]);

	if (loadingBooking) {
		return (
			<div className='space-y-6'>
				<Skeleton className='h-8 w-full' />
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{[...Array(6)].map((_, i) => (
						<div key={i} className='space-y-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-10 w-full' />
						</div>
					))}
				</div>
				<Skeleton className='h-10 w-32' />
			</div>
		);
	}

	if (bookingError) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Failed to load booking details. Please try again.
				</AlertDescription>
			</Alert>
		);
	}

	if (!booking) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Not Found</AlertTitle>
				<AlertDescription>Booking not found.</AlertDescription>
			</Alert>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{serverError && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Update Failed</AlertTitle>
						<AlertDescription>{serverError}</AlertDescription>
					</Alert>
				)}

				{/* Basic Information */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* User Selection */}
					<FormField
						control={form.control}
						name='userId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>User</FormLabel>
								<FormControl>
									<Select 
										onValueChange={field.onChange} 
										value={field.value}
										key={`user-${field.value}-${users.length}`}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select a user' />
										</SelectTrigger>
										<SelectContent>
											{users.map((user) => (
												<SelectItem key={user._id} value={user._id}>
													<div className='flex items-center text-left gap-2'>
														<User className='h-4 w-4' />
														<div>
															<div className='font-medium'>
																{user.firstName && user.lastName 
																	? `${user.firstName} ${user.lastName}` 
																	: 'Unknown User'}
															</div>
															<div className='text-xs text-muted-foreground'>
																{user.email} • {user.tokens} tokens
															</div>
														</div>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								{selectedUser && (
									<FormDescription>
										Selected user has {selectedUser.tokens} tokens available.
									</FormDescription>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Rack Selection */}
					<FormField
						control={form.control}
						name='rackId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rack</FormLabel>
								<FormControl>
									<Select 
										onValueChange={field.onChange} 
										value={field.value}
										key={`rack-${field.value}-${racks.length}`}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select a rack' />
										</SelectTrigger>
										<SelectContent>
											{racks.map((rack) => (
												<SelectItem key={rack._id} value={rack._id}>
													<div className='flex items-center gap-2'>
														<div>
															<div className='font-medium'>{rack.name}</div>
															<div className='text-xs text-muted-foreground'>
																{rack.location} • {rack.status}
															</div>
														</div>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Time and Duration */}
				<div className='grid grid-cols-1 items-start md:grid-cols-2 gap-4'>
					{/* Start Time */}
					<FormField
						control={form.control}
						name='startTime'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Start Time</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='datetime-local'
										className='relative pr-8
													[&&::-webkit-calendar-picker-indicator]:absolute
													[&&::-webkit-calendar-picker-indicator]:right-2
													[&&::-webkit-calendar-picker-indicator]:top-1/2
													[&&::-webkit-calendar-picker-indicator]:-translate-y-1/2
													[&&::-webkit-calendar-picker-indicator]:cursor-pointer
												'
										min={new Date().toISOString().slice(0, 16)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* End Time */}
					<FormField
						control={form.control}
						name='endTime'
						render={({ field }) => (
							<FormItem>
								<FormLabel>End Time</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='datetime-local'
										className='relative pr-8
													[&&::-webkit-calendar-picker-indicator]:absolute
													[&&::-webkit-calendar-picker-indicator]:right-2
													[&&::-webkit-calendar-picker-indicator]:top-1/2
													[&&::-webkit-calendar-picker-indicator]:-translate-y-1/2
													[&&::-webkit-calendar-picker-indicator]:cursor-pointer
												'
										min={startTime || new Date().toISOString().slice(0, 16)}
									/>
								</FormControl>
								{estimatedDuration && (
									<FormDescription>
										<Clock className='inline h-3 w-3 mr-1' />
										Duration: {estimatedDuration}
									</FormDescription>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Cost, Status and Version */}
				<div className='grid grid-cols-1 items-start md:grid-cols-3 gap-4'>
					{/* Token Cost */}
					<FormField
						control={form.control}
						name='tokenCost'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Token Cost</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='number'
										placeholder='Enter token cost'
										min='1'
									/>
								</FormControl>
								{tokenImpact && (
									<FormDescription
										className={
											tokenImpact.type === 'insufficient'
												? 'text-destructive'
												: 'text-muted-foreground'
										}>
										{tokenImpact.type === 'insufficient' &&
											'⚠ User has insufficient tokens'}
										{tokenImpact.type === 'refund' &&
											`✓ ${Math.abs(
												parseInt(tokenImpact.message.match(/\d+/)[0])
											)} tokens will be refunded`}
										{tokenImpact.type === 'deduct' &&
											tokenImpact.sufficient &&
											`✓ User will have ${
												selectedUser.tokens - field.value
											} tokens remaining`}
										{tokenImpact.type === 'transfer' &&
											tokenImpact.sufficient &&
											'✓ Tokens will be transferred between users'}
										{tokenImpact.type === 'no-change' && '✓ No token change'}
									</FormDescription>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Status */}
					<FormField
						control={form.control}
						name='status'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='confirmed'>Confirmed</SelectItem>
											<SelectItem value='provisioning'>Provisioning</SelectItem>
											<SelectItem value='completed'>Completed</SelectItem>
											<SelectItem value='cancelled'>Cancelled</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* ACI Version */}
					<FormField
						control={form.control}
						name='selectedAciVersion'
						render={({ field }) => (
							<FormItem>
								<FormLabel>ACI Version (Optional)</FormLabel>
								<FormControl>
									<Input {...field} placeholder='e.g., 5.2(4e)' />
								</FormControl>
								<FormDescription>
									Specify the ACI version if required for this booking.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Pre-configurations */}
				<FormField
					control={form.control}
					name='selectedPreConfigs'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pre-configurations (Optional)</FormLabel>
							<FormControl>
								<DynamicListInput
									value={field.value || []}
									onChange={field.onChange}
									placeholder='Add pre-configuration'
									addButtonText='Add Configuration'
								/>
							</FormControl>
							<FormDescription>
								Add any pre-configurations needed for this booking.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Summary Card */}
				{selectedUser &&
					selectedRack &&
					form.watch('tokenCost') &&
					estimatedDuration && (
						<div className='rounded-lg border p-4'>
							<h3 className='text-base font-medium mb-3'>
								Updated Booking Summary
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>User:</span>
									<div className='font-medium'>
										{selectedUser.firstName && selectedUser.lastName 
											? `${selectedUser.firstName} ${selectedUser.lastName}` 
											: 'Unknown User'}
									</div>
								</div>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>Rack:</span>
									<div className='font-medium'>{selectedRack.name}</div>
								</div>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>Duration:</span>
									<div className='font-medium'>{estimatedDuration}</div>
								</div>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>Cost:</span>
									<div className='font-medium'>
										{form.watch('tokenCost')} tokens
									</div>
								</div>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>Status:</span>
									<div className='font-medium'>{form.watch('status')}</div>
								</div>
								{tokenImpact && (
									<div className='space-y-0.5'>
										<span className='text-muted-foreground'>Token Impact:</span>
										<div className='font-medium'>{tokenImpact.message}</div>
									</div>
								)}
							</div>
						</div>
					)}

				{/* Form Actions */}
				<div className='flex justify-end gap-2 pt-4'>
					<Button
						variant='outline'
						type='button'
						onClick={() => router.push('/admin/bookings')}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={
							updateBookingMutation.isPending ||
							tokenImpact?.type === 'insufficient'
						}>
						{updateBookingMutation.isPending ? 'Updating...' : 'Update Booking'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
