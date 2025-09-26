'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
	const router = useRouter();
	const [error, setError] = useState('');

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const errorParam = urlParams.get('error');
		setError(errorParam || 'unknown_error');
	}, []);

	const getErrorMessage = (errorCode) => {
		switch (errorCode) {
			case 'oauth_error':
				return 'There was an error during Google authentication.';
			case 'oauth_failed':
				return 'Google authentication failed. Please try again.';
			case 'token_generation_failed':
				return 'Authentication succeeded but token generation failed.';
			case 'no_token':
				return 'No authentication token received.';
			default:
				return 'An unknown error occurred during authentication.';
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Authentication Error
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						{getErrorMessage(error)}
					</p>
					<div className="mt-6">
						<button
							onClick={() => router.push('/signin')}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}