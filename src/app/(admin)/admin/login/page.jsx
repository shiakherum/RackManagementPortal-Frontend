'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated' && session?.user?.role === 'Admin') {
			router.replace('/admin/dashboard');
		}
	}, [session, status, router]);

	if (status === 'loading') {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='flex flex-col items-center space-y-4'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
					<p className='text-sm text-muted-foreground'>Loading...</p>
				</div>
			</div>
		);
	}

	if (status === 'authenticated' && session?.user?.role === 'Admin') {
		return null;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});

			if (result.error) {
				setError(result.error);
				setIsLoading(false);
			} else {
				router.replace('/admin/dashboard');
			}
		} catch (err) {
			setError('An unexpected error occurred. Please try again.');
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-6'>
			<div className='flex flex-col gap-6 w-full max-w-sm'>
				{/* Logo and Back Link */}
				<div className='flex flex-col items-center text-center'>
					<Link href='/'>
						<img
							alt='ACI Rack Rentals'
							src='/logo-3.svg'
							className='h-11 w-auto mb-6'
						/>
					</Link>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Admin Portal Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access the admin panel.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<div className='flex flex-col gap-6'>
								{/* Error Alert */}
								{error && (
									<Alert variant='destructive'>
										<AlertCircle className='h-4 w-4' />
										<AlertDescription>
											<strong>Login Failed:</strong> {error}
										</AlertDescription>
									</Alert>
								)}

								{/* Email Field */}
								<div className='grid gap-3'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										name='email'
										type='email'
										placeholder='admin@example.com'
										required
										autoComplete='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								{/* Password Field */}
								<div className='grid gap-3'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										name='password'
										type='password'
										required
										autoComplete='current-password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>

								{/* Submit Button */}
								<Button
									type='submit'
									className='w-full cursor-pointer'
									disabled={isLoading}>
									{isLoading ? 'Signing in...' : 'Sign in'}
								</Button>
							</div>

							{/* Footer Links */}
							<div className='mt-4 text-center text-sm'>
								<Link href='/' className='hover:text-primary'>
									← Back to main site
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Support Link */}
				<div className='text-center text-sm text-muted-foreground'>
					Need help?{' '}
					<a
						href='#'
						className='underline underline-offset-4 hover:text-primary'>
						Contact IT Support
					</a>
				</div>
			</div>
		</div>
	);
}
