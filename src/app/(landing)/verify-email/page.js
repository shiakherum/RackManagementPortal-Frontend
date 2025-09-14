'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Create a separate component that uses useSearchParams
const VerifyEmailContent = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
	const [message, setMessage] = useState('Verifying your email...');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage(
				'Verification token not found. Please check the link and try again.'
			);
			return;
		}

		const verifyToken = async () => {
			try {
				const response = await api.get(`/auth/verify-email/${token}`);
				setStatus('success');
				setMessage(
					response.data.data.message ||
						'Email verified successfully! You can now log in.'
				);
			} catch (error) {
				setStatus('error');
				setMessage(
					error.response?.data?.message ||
						'An error occurred during verification. Please try again later.'
				);
			}
		};

		verifyToken();
	}, [token]);

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='p-8 bg-white shadow-md rounded-lg max-w-md text-center'>
				{status === 'verifying' && (
					<div className='text-blue-500'>
						<p>{message}</p>
					</div>
				)}
				{status === 'success' && (
					<div className='text-green-500'>
						<h2 className='text-2xl font-bold mb-4'>Email Verified!</h2>
						<p>{message}</p>
						<Link
							href='/signin'
							className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
							Go to Login
						</Link>
					</div>
				)}
				{status === 'error' && (
					<div className='text-red-500'>
						<h2 className='text-2xl font-bold mb-4'>Verification Failed</h2>
						<p>{message}</p>
						<Link
							href='/signin'
							className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
							Go to Sign In
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

// Loading component for Suspense fallback
const VerifyEmailLoading = () => (
	<div className='flex items-center justify-center min-h-screen bg-gray-100'>
		<div className='p-8 bg-white shadow-md rounded-lg max-w-md text-center'>
			<div className='text-blue-500'>
				<p>Loading...</p>
			</div>
		</div>
	</div>
);

// Main page component with Suspense boundary
const VerifyEmailPage = () => {
	return (
		<Suspense fallback={<VerifyEmailLoading />}>
			<VerifyEmailContent />
		</Suspense>
	);
};

export default VerifyEmailPage;
