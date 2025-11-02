'use client';

import { PlusIcon } from '@heroicons/react/16/solid';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TokenPacks() {
	const { isAuthenticated } = useStudentAuth();
	const router = useRouter();
	const [tokenPacks, setTokenPacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [purchasing, setPurchasing] = useState(null);

	// INR to USD conversion rate (approximate)
	const INR_TO_USD_RATE = 0.012;

	useEffect(() => {
		fetchTokenPacks();
	}, []);

	const fetchTokenPacks = async () => {
		try {
			const response = await api.get('/token-packs');
			if (response.data.success) {
				setTokenPacks(response.data.data);
			}
		} catch (error) {
			console.error('Error fetching token packs:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePurchase = async (tokenPack) => {
		if (!isAuthenticated) {
			router.push('/signin');
			return;
		}

		setPurchasing(tokenPack._id);
		try {
			const response = await api.post('/orders/create', {
				tokenPackId: tokenPack._id,
			});

			if (response.data.success) {
				const { orderId, amount, currency, key } = response.data.data;

				const options = {
					key: key,
					amount: amount,
					currency: currency,
					name: 'Cisco ACI Rack Rentals',
					description: `${tokenPack.name} - ${tokenPack.tokensGranted} tokens`,
					order_id: orderId,
					handler: async function (response) {
						try {
							// Verify payment with backend
							const verifyResponse = await api.post('/orders/verify', {
								razorpayOrderId: response.razorpay_order_id,
								razorpayPaymentId: response.razorpay_payment_id,
								razorpaySignature: response.razorpay_signature,
							});

							if (verifyResponse.data.success) {
								// Redirect to success page with payment details
								const params = new URLSearchParams({
									tokens: tokenPack.tokensGranted.toString(),
									package: tokenPack.name,
									amount: amount.toString(),
								});
								router.push(`/payment-success?${params.toString()}`);
							} else {
								alert('Payment verification failed. Please contact support.');
							}
						} catch (error) {
							console.error('Error verifying payment:', error);
							alert('Error verifying payment. Please contact support with your payment ID: ' + response.razorpay_payment_id);
						}
					},
					prefill: {
						name: 'User',
						email: 'user@example.com',
					},
					theme: {
						color: '#3B82F6',
					},
				};

				const rzp1 = new window.Razorpay(options);
				rzp1.open();
			}
		} catch (error) {
			console.error('Error creating order:', error);
			alert('Error creating order. Please try again.');
		} finally {
			setPurchasing(null);
		}
	};

	if (loading) {
		return (
			<div className='bg-white py-24 sm:py-32'>
				<div className='mx-auto max-w-4xl px-6 text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Loading token packs...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white py-24 sm:py-32'>
			<div className='mx-auto max-w-4xl px-6 max-lg:text-center lg:max-w-7xl lg:px-8'>
				<h1 className='text-5xl font-semibold tracking-tight text-balance text-gray-950 sm:text-6xl lg:text-pretty'>
					Flexible token packs for every project
				</h1>
				<p className='mt-6 max-w-3xl text-lg font-medium text-pretty text-gray-500 max-lg:mx-auto sm:text-xl/8'>
					Buy tokens once, spend them whenever you need lab time—no monthly
					commitment, no hidden fees.
				</p>
			</div>
			<div className='relative pt-16 sm:pt-24'>
				<div className='absolute inset-x-0 top-48 bottom-0 bg-[radial-gradient(circle_at_center_center,#7775D6,#592E71,#030712_70%)] lg:bg-[radial-gradient(circle_at_center_150%,#7775D6,#6366f1,#030712_70%)]' />
				<div className='relative mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8'>
					<div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
						{tokenPacks.map((pack) => (
							<div
								key={pack._id}
								className='relative -m-2 grid w-full max-w-md grid-cols-1 rounded-[2rem] ring-1 ring-black/5 shadow-[inset_0_0_2px_1px_#ffffff4d] sm:mx-auto lg:mx-0'>
								<div className='grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5'>
									<div className='rounded-3xl bg-white p-10 pb-9 ring-1 ring-black/5 shadow-2xl'>
										{/* Pack title */}
										<h2 className='text-lg font-bold text-indigo-600'>
											{pack.name}
										</h2>
										<p className='mt-2 text-sm text-gray-600'>
											{pack.description}
										</p>

										{/* Token + price display */}
										<div className='mt-8 flex items-end gap-4'>
											<div className='text-5xl font-extrabold text-gray-950'>
												<span className='opacity-25'>T</span>
												{pack.tokensGranted}
											</div>
											<div className='text-sm font-medium text-gray-600'>
												<p>Tokens</p>
												<p className='mt-0.5 font-bold text-gray-900'>
													₹{(pack.price / 100).toFixed(2)}
												</p>
												<p className='text-xs text-gray-500'>
													≈ ${((pack.price / 100) * INR_TO_USD_RATE).toFixed(2)} USD
												</p>
											</div>
										</div>

										{/* CTA */}
										<div className='mt-8'>
											<button
												onClick={() => handlePurchase(pack)}
												disabled={purchasing === pack._id}
												className='inline-block w-full rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'>
												{purchasing === pack._id ? 'Processing...' : isAuthenticated ? 'Buy now' : 'Sign in to buy'}
											</button>
										</div>

										{/* Default highlights for all packs */}
										<div className='mt-8'>
											<h3 className='text-sm font-medium text-gray-950'>
												Includes:
											</h3>
											<ul className='mt-3 space-y-3'>
												{[
													{ description: 'Instant rack booking' },
													{ description: 'Power-cycle controls' },
													{ description: 'APIC GUI + console access' },
													{ description: '24-hour ticket support' },
												].map(({ description }) => (
													<li
														key={description}
														className='group flex items-start gap-4 text-sm text-gray-600'>
														<span className='inline-flex h-6 items-center'>
															<PlusIcon
																className='h-4 w-4 fill-gray-400'
																aria-hidden='true'
															/>
														</span>
														<span>{description}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className='flex justify-between py-16 opacity-60 max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4 sm:py-10'></div>
				</div>
			</div>
		</div>
	);
}
