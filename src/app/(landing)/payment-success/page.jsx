'use client';

import { CheckCircle, ArrowRight, Coins } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, Suspense } from 'react';

function PaymentSuccessContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [details, setDetails] = useState({
		tokensAdded: searchParams.get('tokens') || '0',
		packageName: searchParams.get('package') || 'Token Pack',
		amount: searchParams.get('amount') || '0',
	});

	useEffect(() => {
		// Auto-redirect after 10 seconds
		const timer = setTimeout(() => {
			router.push('/dashboard');
		}, 10000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4'>
			<Card className='w-full max-w-2xl shadow-2xl'>
				<CardContent className='p-8 md:p-12'>
					<div className='text-center space-y-6'>
						{/* Success Icon */}
						<div className='flex justify-center'>
							<div className='relative'>
								<div className='absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse'></div>
								<div className='relative bg-green-500 rounded-full p-6'>
									<CheckCircle className='w-16 h-16 text-white' />
								</div>
							</div>
						</div>

						{/* Success Message */}
						<div className='space-y-2'>
							<h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
								Payment Successful!
							</h1>
							<p className='text-lg text-gray-600'>
								Your tokens have been added to your account
							</p>
						</div>

						{/* Token Details */}
						<div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100'>
							<div className='flex items-center justify-center gap-3 mb-4'>
								<Coins className='w-8 h-8 text-indigo-600' />
								<span className='text-5xl font-bold text-indigo-600'>
									+{details.tokensAdded}
								</span>
								<span className='text-2xl font-semibold text-gray-600'>
									Tokens
								</span>
							</div>
							<div className='space-y-2 text-sm text-gray-600'>
								<div className='flex justify-between items-center'>
									<span className='font-medium'>Package:</span>
									<span className='text-gray-900 font-semibold'>
										{details.packageName}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='font-medium'>Amount Paid:</span>
									<span className='text-gray-900 font-semibold'>
										₹{(parseInt(details.amount) / 100).toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						{/* Additional Info */}
						<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
							<p className='text-sm text-blue-800'>
								<strong>What's next?</strong> Use your tokens to book ACI lab racks
								and start your hands-on practice sessions.
							</p>
						</div>

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-4 pt-4'>
							<Button
								onClick={() => router.push('/dashboard')}
								className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all'>
								Go to Dashboard
								<ArrowRight className='ml-2 w-5 h-5' />
							</Button>
							<Button
								onClick={() => router.push('/racks')}
								variant='outline'
								className='flex-1 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-6 text-lg font-semibold rounded-xl'>
								Browse Racks
							</Button>
						</div>

						{/* Auto-redirect notice */}
						<p className='text-xs text-gray-500 pt-4'>
							You will be automatically redirected to your dashboard in a few
							seconds...
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={<div className='min-h-screen flex items-center justify-center'>Loading...</div>}>
			<PaymentSuccessContent />
		</Suspense>
	);
}
