'use client';

import { PlusIcon } from '@heroicons/react/16/solid';
import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TokenPacksPage() {
	const { user, isAuthenticated, loading: authLoading } = useStudentAuth();
	const router = useRouter();
	const [tokenPacks, setTokenPacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [purchasing, setPurchasing] = useState(null);

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
							alert(
								'Error verifying payment. Please contact support with your payment ID: ' +
									response.razorpay_payment_id
							);
						}
					},
					prefill: {
						name: user?.firstName + ' ' + user?.lastName || 'User',
						email: user?.email || 'user@example.com',
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

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading token packs...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<button
						onClick={() => router.push('/dashboard')}
						className="text-indigo-600 hover:text-indigo-500 mb-4"
					>
						← Back to Dashboard
					</button>
					<h1 className="text-3xl font-bold text-gray-900">Token Packs</h1>
					<p className="mt-2 text-gray-600">
						Purchase tokens to book and access lab racks. Choose the pack that best fits your
						needs.
					</p>
				</div>

				{/* Current Balance Card */}
				{isAuthenticated && (
					<div className="bg-white shadow rounded-lg p-6 mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-sm font-medium text-gray-500">Current Token Balance</h3>
								<p className="mt-2 text-4xl font-bold text-indigo-600">
									{user?.tokens || 0}
								</p>
								<p className="mt-1 text-sm text-gray-500">Available tokens</p>
							</div>
							<div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
								<span className="text-3xl">🎫</span>
							</div>
						</div>
					</div>
				)}

				{/* Token Packs Grid */}
				{tokenPacks.length === 0 ? (
					<div className="bg-white shadow rounded-lg p-12 text-center">
						<p className="text-gray-500">No token packs available at the moment.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{tokenPacks.map((pack) => (
							<div
								key={pack._id}
								className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
							>
								<div className="p-6">
									{/* Pack Header */}
									<div className="text-center border-b border-gray-200 pb-6 mb-6">
										<h2 className="text-2xl font-bold text-gray-900">{pack.name}</h2>
										<p className="mt-2 text-sm text-gray-600">{pack.description}</p>
									</div>

									{/* Token Amount */}
									<div className="text-center mb-6">
										<div className="inline-flex items-baseline">
											<span className="text-5xl font-extrabold text-indigo-600">
												{pack.tokensGranted}
											</span>
											<span className="ml-2 text-2xl font-semibold text-gray-600">
												Tokens
											</span>
										</div>
									</div>

									{/* Price */}
									<div className="text-center mb-6">
										<div className="inline-flex items-baseline">
											<span className="text-3xl font-bold text-gray-900">
												₹{(pack.price / 100).toFixed(2)}
											</span>
										</div>
										<p className="mt-1 text-sm text-gray-500">
											₹{((pack.price / 100) / pack.tokensGranted).toFixed(2)} per token
										</p>
									</div>

									{/* Features */}
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-gray-900 mb-3">
											Includes:
										</h3>
										<ul className="space-y-2">
											{[
												'Instant rack booking',
												'Power-cycle controls',
												'APIC GUI + console access',
												'24-hour ticket support',
											].map((feature, index) => (
												<li key={index} className="flex items-start">
													<PlusIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
													<span className="text-sm text-gray-600">{feature}</span>
												</li>
											))}
										</ul>
									</div>

									{/* Purchase Button */}
									<button
										onClick={() => handlePurchase(pack)}
										disabled={purchasing === pack._id}
										className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
											purchasing === pack._id
												? 'bg-gray-400 cursor-not-allowed'
												: 'bg-indigo-600 hover:bg-indigo-700'
										}`}
									>
										{purchasing === pack._id
											? 'Processing...'
											: isAuthenticated
											? 'Buy Now'
											: 'Sign in to Buy'}
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Help Section */}
				<div className="mt-12 bg-indigo-50 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Need help?</h3>
					<p className="text-sm text-gray-600">
						Not sure which token pack to choose? Each token allows you to book a rack for one
						hour. Estimate how many hours of lab time you'll need and select the corresponding
						pack. Tokens never expire, so you can use them whenever you need.
					</p>
				</div>
			</div>
		</div>
	);
}
