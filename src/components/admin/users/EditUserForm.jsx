'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import { AlertCircle, Mail, ShieldCheck, ShieldX } from 'lucide-react';

// Define the validation schema for editing (password is not included)
const formSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'First name must be at least 2 characters.' }),
	lastName: z
		.string()
		.min(2, { message: 'Last name must be at least 2 characters.' }),
	username: z
		.string()
		.min(5, { message: 'Username must be at least 5 characters.' })
		.max(20, { message: 'Username must be no more than 20 characters.' })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: 'Username can only contain letters, numbers, and underscores.',
		})
		.toLowerCase(),
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	role: z.enum(['Standard User', 'Power User', 'Admin']),
	tokens: z.coerce.number().int().min(0),
	isActive: z.boolean(),
	isEmailVerified: z.boolean(),
});

export default function EditUserForm({ user }) {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');

	// Split the user's name into firstName and lastName for editing
	const [firstName = '', lastName = ''] = user.name
		? user.name.split(' ')
		: ['', ''];

	const form = useForm({
		resolver: zodResolver(formSchema),
		// Pre-populate the form with the user's existing data
		defaultValues: {
			firstName: firstName,
			lastName: lastName,
			username: user.username || '',
			email: user.email || '',
			role: user.role || 'Standard User',
			tokens: user.tokens || 0,
			isActive: user.isActive,
			isEmailVerified: user.isEmailVerified || false,
		},
	});

	// Mutation for updating a user
	const updateUserMutation = useMutation({
		mutationFn: (updatedUserData) => {
			return api.patch(`/admin/users/${user._id}`, updatedUserData, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
			console.log('User updated successfully!');
			router.push('/admin/users');
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || 'An unexpected error occurred.';
			setServerError(message);
		},
	});

	// Mutation for resending verification email
	const resendVerificationMutation = useMutation({
		mutationFn: () => {
			return api.post(
				`/admin/users/${user._id}/resend-verification`,
				{},
				{
					headers: { Authorization: `Bearer ${session.accessToken}` },
				}
			);
		},
		onSuccess: () => {
			console.log('Verification email sent successfully!');
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || 'Failed to send verification email.';
			setServerError(message);
		},
	});

	function onSubmit(values) {
		setServerError('');
		// Send firstName and lastName separately (no need to combine into name)
		updateUserMutation.mutate(values);
	}

	function handleResendVerification() {
		setServerError('');
		resendVerificationMutation.mutate();
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

				{/* Email Verification Status Section */}
				<div className='rounded-lg border p-4 space-y-3'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<h3 className='text-base font-medium'>
								Email Verification Status
							</h3>
							<p className='text-sm text-muted-foreground'>
								Manage the user's email verification status
							</p>
						</div>
						<div className='flex items-center gap-3'>
							{user.isEmailVerified ? (
								<Badge variant='default' className='gap-1'>
									<ShieldCheck className='h-3 w-3' />
									Verified
								</Badge>
							) : (
								<div className='flex items-center gap-2'>
									<Badge variant='destructive' className='gap-1'>
										<ShieldX className='h-3 w-3' />
										Unverified
									</Badge>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={handleResendVerification}
										disabled={resendVerificationMutation.isPending}
										className='gap-1'>
										<Mail className='h-3 w-3' />
										{resendVerificationMutation.isPending
											? 'Sending...'
											: 'Resend'}
									</Button>
								</div>
							)}
						</div>
					</div>

					<FormField
						control={form.control}
						name='isEmailVerified'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
								<div className='space-y-0.5'>
									<FormLabel className='text-sm font-medium'>
										Override Email Verification
									</FormLabel>
									<FormDescription className='text-xs'>
										Manually set the email verification status for this user
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{/* Basic Information */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Username and Email */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										{...field}
										onChange={(e) =>
											field.onChange(e.target.value.toLowerCase())
										}
									/>
								</FormControl>
								<FormDescription>
									5-20 characters. Letters, numbers, and underscores only.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<Input type='email' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Role and Tokens */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='role'
						render={({ field }) => (
							<FormItem>
								<FormLabel>User Role</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='Standard User'>Standard User</SelectItem>
										<SelectItem value='Power User'>Power User</SelectItem>
										<SelectItem value='Admin'>Admin</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='tokens'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tokens</FormLabel>
								<FormControl>
									<Input type='number' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Account Status */}
				<FormField
					control={form.control}
					name='isActive'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
							<div className='space-y-0.5'>
								<FormLabel className='text-base'>Account Status</FormLabel>
								<FormDescription>
									Inactive accounts will not be able to log in.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Form Actions */}
				<div className='flex justify-end gap-2 pt-4'>
					<Button
						variant='outline'
						type='button'
						onClick={() => router.push('/admin/users')}>
						Cancel
					</Button>
					<Button type='submit' disabled={updateUserMutation.isPending}>
						{updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
