'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Clock, Plus, User } from 'lucide-react';
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
import api from '@/lib/api';

// Booking form schema
const addBookingSchema = z.object({
	userId: z.string().min(1, 'User is required'),
	rackId: z.string().min(1, 'Rack is required'),
	startTime: z.string().min(1, 'Start time is required'),
	endTime: z.string().min(1, 'End time is required'),
	tokenCost: z.coerce.number().min(1, 'Token cost must be at least 1'),
	selectedAciVersion: z.string().optional(),
	selectedPreConfigs: z.array(z.string()).optional(),
});

export default function AddBookingForm() {
	const { data: session } = useSession();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');

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
		resolver: zodResolver(addBookingSchema),
		defaultValues: {
			userId: '',
			rackId: '',
			startTime: '',
			endTime: '',
			tokenCost: 0,
			selectedAciVersion: '',
			selectedPreConfigs: [],
		},
		mode: 'onChange',
	});

	// Create booking mutation
	const createBookingMutation = useMutation({
		mutationFn: async (data) => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			return api.post('/admin/bookings', data, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['adminBookings']);
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

		createBookingMutation.mutate(formattedData);
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

	// Get selected user's token balance
	const selectedUserId = form.watch('userId');
	const selectedUser = users.find((user) => user._id === selectedUserId);
	const selectedRackId = form.watch('rackId');
	const selectedRack = racks.find((rack) => rack._id === selectedRackId);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{serverError && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Creation Failed</AlertTitle>
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
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder='Select a user' />
										</SelectTrigger>
										<SelectContent>
											{users.map((user) => (
												<SelectItem key={user._id} value={user._id}>
													<div className='flex items-center text-left gap-2'>
														<User className='h-4 w-4' />
														<div>
															<div className='font-medium'>{user.name}</div>
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
									<Select onValueChange={field.onChange} value={field.value}>
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

				{/* Cost and Version */}
				<div className='grid grid-cols-1 items-start md:grid-cols-2 gap-4'>
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
								{selectedUser && field.value && (
									<FormDescription
										className={
											field.value > selectedUser.tokens
												? 'text-destructive'
												: 'text-muted-foreground'
										}>
										{field.value > selectedUser.tokens
											? `⚠ User has insufficient tokens (${selectedUser.tokens} available)`
											: `✓ User will have ${
													selectedUser.tokens - field.value
											  } tokens remaining`}
									</FormDescription>
								)}
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
							<h3 className='text-base font-medium mb-3'>Booking Summary</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
								<div className='space-y-0.5'>
									<span className='text-muted-foreground'>User:</span>
									<div className='font-medium'>{selectedUser.name}</div>
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
					<Button type='submit' disabled={createBookingMutation.isPending}>
						{createBookingMutation.isPending ? 'Creating...' : 'Create Booking'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
