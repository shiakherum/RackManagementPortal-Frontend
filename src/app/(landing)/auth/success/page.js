'use client';

import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthSuccessPage() {
	const { handleGoogleCallback } = useStudentAuth();
	const router = useRouter();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			handleGoogleCallback(token);
			router.push('/dashboard');
		} else {
			router.push('/auth/error?error=no_token');
		}
	}, [handleGoogleCallback, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Login Successful
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Redirecting you to your dashboard...
					</p>
				</div>
			</div>
		</div>
	);
}