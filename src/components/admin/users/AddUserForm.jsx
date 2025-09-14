// components/admin/users/AddUserForm.jsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import { AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';

// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password = '' }) => {
	const getStrength = () => {
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	};

	const strength = getStrength();
	const strengthLevels = [
		{ text: '', color: '', bgColor: '' },
		{ text: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-500' },
		{ text: 'Weak', color: 'text-orange-600', bgColor: 'bg-orange-500' },
		{ text: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
		{ text: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' },
		{ text: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' },
	];

	const current = strengthLevels[strength];

	if (!password) return null;

	return (
		<div className='space-y-1 mt-2'>
			<div className='flex items-center justify-between'>
				<span className={`text-xs font-medium ${current.color}`}>
					{current.text}
				</span>
				<span className='text-xs text-muted-foreground'>{strength}/5</span>
			</div>
			<div className='w-full bg-muted rounded-full h-1.5'>
				<div
					className={`h-1.5 rounded-full transition-all duration-300 ${current.bgColor}`}
					style={{ width: `${(strength / 5) * 100}%` }}
				/>
			</div>
		</div>
	);
};

// Define the validation schema using Zod
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
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters.' }),
	role: z.enum(['Standard User', 'Power User', 'Admin'], {
		required_error: 'You need to select a user role.',
	}),
	tokens: z.coerce
		.number()
		.int()
		.min(0, { message: 'Tokens must be a positive number.' })
		.default(0),
	isActive: z.boolean().default(true),
});

export default function AddUserForm() {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			password: '',
			role: 'Standard User',
			tokens: 0,
			isActive: true,
		},
		mode: 'onChange',
	});

	const passwordValue = form.watch('password');

	const generateStrongPassword = () => {
		const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lower = 'abcdefghijklmnopqrstuvwxyz';
		const numbers = '0123456789';
		const symbols = '!@#$%^&*';
		const allChars = upper + lower + numbers + symbols;

		let newPassword = '';
		// Ensure at least one character from each type
		newPassword += upper[Math.floor(Math.random() * upper.length)];
		newPassword += lower[Math.floor(Math.random() * lower.length)];
		newPassword += numbers[Math.floor(Math.random() * numbers.length)];
		newPassword += symbols[Math.floor(Math.random() * symbols.length)];

		// Fill remaining with random characters
		for (let i = 4; i < 12; i++) {
			newPassword += allChars[Math.floor(Math.random() * allChars.length)];
		}

		// Shuffle the password
		newPassword = newPassword
			.split('')
			.sort(() => 0.5 - Math.random())
			.join('');

		form.setValue('password', newPassword, { shouldValidate: true });
	};

	const createUserMutation = useMutation({
		mutationFn: (newUserData) => {
			return api.post('/admin/users', newUserData, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
			router.push('/admin/users');
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || 'An unexpected error occurred.';
			setServerError(message);
		},
	});

	function onSubmit(values) {
		setServerError('');
		// Send firstName and lastName separately (no need to combine into name)
		createUserMutation.mutate(values);
	}

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
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder='John' {...field} />
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
									<Input placeholder='Doe' {...field} />
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
										placeholder='johndoe123'
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
									<Input
										type='email'
										placeholder='user@company.com'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Password */}
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<div className='flex items-center justify-between'>
								<FormLabel>Password</FormLabel>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={generateStrongPassword}
									className='h-8 gap-1.5'>
									<RefreshCw className='h-3 w-3' />
									Generate
								</Button>
							</div>
							<div className='relative'>
								<FormControl>
									<Input
										type={showPassword ? 'text' : 'password'}
										placeholder='Enter secure password'
										{...field}
										className='pr-10'
									/>
								</FormControl>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7'
									onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
							<PasswordStrengthIndicator password={passwordValue} />
							<FormDescription>
								User will be prompted to change password on first login.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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
											<SelectValue placeholder='Select a role' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='Standard User'>Standard User</SelectItem>
										<SelectItem value='Power User'>Power User</SelectItem>
										<SelectItem value='Admin'>Administrator</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									Choose the appropriate role based on required access level.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='tokens'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Initial Tokens</FormLabel>
								<FormControl>
									<Input type='number' placeholder='0' {...field} />
								</FormControl>
								<FormDescription>
									Number of tokens to credit initially.
								</FormDescription>
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
					<Button type='submit' disabled={createUserMutation.isPending}>
						{createUserMutation.isPending ? 'Creating...' : 'Create User'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
