'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useStudentAuth } from '@/lib/student-auth';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Form validation schema
const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

export function LoginForm({ className, ...props }) {
	const router = useRouter();
	const { login } = useStudentAuth();
	const [isLoading, setIsLoading] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const [error, setError] = React.useState('');

	// Form setup
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	// Handle form submission
	const onSubmit = async (data) => {
		setIsLoading(true);
		setError('');

		try {
			const result = await login(data.email, data.password);

			if (result.success) {
				toast.success('Login successful!');
				router.push('/user/dashboard');
			} else {
				setError(result.error);
				toast.error(result.error);
			}
		} catch (err) {
			const errorMessage = err.message || 'An unexpected error occurred';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-6'>
						{/* Header */}
						<div className='flex flex-col items-center gap-2'>
							<Link
								href='/'
								className='flex flex-col items-center gap-2 font-medium'>
								<div className='flex size-8 items-center justify-center rounded-md bg-indigo-600'>
									<GalleryVerticalEnd className='size-6 text-white' />
								</div>
								<span className='sr-only'>ACI Rack Rentals</span>
							</Link>
							<h1 className='text-xl font-bold text-gray-900'>
								Welcome to ACI Rack Rentals
							</h1>
							<div className='text-center text-sm text-gray-600'>
								Don&apos;t have an account?{' '}
								<Link
									href='/contact'
									className='text-indigo-600 underline underline-offset-4 hover:text-indigo-500'>
									Contact us
								</Link>
							</div>
						</div>

						{/* Error Alert */}
						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Login Failed</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* Form Fields */}
						<div className='flex flex-col gap-6'>
							<div className='grid gap-3'>
								{/* Email Field */}
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='email'>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													id='email'
													type='email'
													placeholder='your.email@example.com'
													autoComplete='email'
													disabled={isLoading}
													className='focus:ring-indigo-500 focus:border-indigo-500 bg-white'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Password Field */}
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='password'>Password</FormLabel>
											<FormControl>
												<div className='relative'>
													<Input
														{...field}
														id='password'
														type={showPassword ? 'text' : 'password'}
														placeholder='Enter your password'
														autoComplete='current-password'
														disabled={isLoading}
														className='pr-10 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
													/>
													<Button
														type='button'
														variant='ghost'
														size='sm'
														className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
														onClick={() => setShowPassword(!showPassword)}
														disabled={isLoading}>
														{showPassword ? (
															<EyeOff className='h-4 w-4 text-gray-400' />
														) : (
															<Eye className='h-4 w-4 text-gray-400' />
														)}
														<span className='sr-only'>
															{showPassword ? 'Hide password' : 'Show password'}
														</span>
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Submit Button */}
							<Button
								type='submit'
								className='w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
								disabled={isLoading}>
								{isLoading ? 'Signing in...' : 'Sign in'}
							</Button>
						</div>
					</div>
				</form>
			</Form>

			{/* Footer */}
			<div className='text-muted-foreground text-center text-xs text-balance mt-5'>
				By clicking continue, you agree to our{' '}
				<Link
					href='/terms-and-conditions'
					className='underline underline-offset-4 hover:text-indigo-600'>
					Terms of Service
				</Link>{' '}
				and{' '}
				<Link
					href='/privacy-policy'
					className='underline underline-offset-4 hover:text-indigo-600'>
					Privacy Policy
				</Link>
				.
			</div>
		</div>
	);
}
