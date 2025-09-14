'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginRedirectPage() {
	const router = useRouter();

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center'>
				<h1 className='text-2xl font-bold text-gray-900 mb-4'>Choose Login Type</h1>
				<p className='text-gray-600 mb-8'>Please select the appropriate login for your account type.</p>
				
				<div className='space-y-4'>
					<Link
						href='/user/login'
						className='block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors'>
						Student/User Login
					</Link>
					
					<Link
						href='/admin/login'
						className='block w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors'>
						Admin Login
					</Link>
				</div>
				
				<p className='text-sm text-gray-500 mt-6'>
					Not sure? Contact your administrator for assistance.
				</p>
			</div>
		</div>
	);
}