'use client';

import { useStudentAuth } from '@/lib/student-auth';

function GoogleSignInButton() {
	const { loginWithGoogle } = useStudentAuth();

	return (
		<button
			onClick={loginWithGoogle}
			className='group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
			<svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true'>
				<path
					d='M12 4.75c1.77 0 3.36.61 4.61 1.8l3.43-3.43C17.95 1.2 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.09C6.22 6.87 8.87 4.75 12 4.75z'
					fill='#EA4335'
				/>
				<path
					d='M23.49 12.27c0-.78-.07-1.53-.19-2.27H12v4.51h6.47c-.29 1.48-1.13 2.74-2.39 3.54l3.86 3C21.91 18.99 23.49 15.92 23.49 12.27z'
					fill='#4285F4'
				/>
				<path
					d='M5.26 14.29A7.19 7.19 0 0 1 4.89 12c0-.8.14-1.57.37-2.29L1.27 6.61A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.98-3.1z'
					fill='#FBBC05'
				/>
				<path
					d='M12 24c3.24 0 5.95-1.07 7.95-2.9l-3.86-3c-1.03.69-2.36 1.14-4.09 1.14-3.13 0-5.78-2.12-6.73-5.05l-3.99 3.1C3.26 21.31 7.31 24 12 24z'
					fill='#34A853'
				/>
			</svg>
			Continue with Google
		</button>
	);
}

export default function SignIn() {
	return (
		<div className='flex'>
			{/* Left column: sign-in + value prop */}
			<div className='flex flex-1 flex-col justify-center bg-gradient-to-br from-slate-50 to-white px-4 py-12 sm:px-6 lg:px-20 xl:px-24'>
				<div className='mx-auto w-full max-w-md py-24'>
					{/* Heading */}
					<div className='mb-8'>
						<h2 className='mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
							Sign in to rent a rack
						</h2>
						<p className='text-lg text-gray-600'>
							Join thousands of engineers validating Cisco&nbsp;ACI designs on
							real hardware—no wiring closet required.
						</p>
					</div>

					{/* Rack-specific benefits */}
					<div className='mb-8 space-y-3'>
						{[
							'Book a clean fabric in <5 minutes',
							'Pay-as-you-go token billing',
							'TLS-secured WebSSH & VNC consoles',
						].map((item) => (
							<div key={item} className='flex items-center space-x-3'>
								<span className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100'>
									<svg
										className='h-3 w-3 text-green-600'
										fill='none'
										stroke='currentColor'
										strokeWidth={2}
										strokeLinecap='round'
										strokeLinejoin='round'
										viewBox='0 0 24 24'>
										<path d='M5 13l4 4L19 7' />
									</svg>
								</span>
								<span
									className='text-gray-700'
									dangerouslySetInnerHTML={{ __html: item }}
								/>
							</div>
						))}
					</div>

					{/* Google SSO button */}
					<div className='space-y-4'>
						<GoogleSignInButton />

						<p className='text-center text-sm text-gray-500'>
							By signing in, you agree to our{' '}
							<a
								href='/terms'
								className='font-medium text-indigo-600 hover:text-indigo-500'>
								Terms of Service
							</a>{' '}
							and{' '}
							<a
								href='/privacy'
								className='font-medium text-indigo-600 hover:text-indigo-500'>
								Privacy Policy
							</a>
							.
						</p>
					</div>

					{/* Trust indicators */}
					<div className='mt-8 border-t border-gray-200 pt-6'>
						<p className='mb-4 text-center text-sm text-gray-500'>
							Trusted by 8,000+ network engineers
						</p>
						<div className='flex justify-center gap-x-6 opacity-60'>
							<div className='text-xs font-semibold text-gray-400'>
								100% Uptime SLO
							</div>
							<div className='text-xs font-semibold text-gray-400'>
								SOC 2&nbsp;Type II
							</div>
							<div className='text-xs font-semibold text-gray-400'>
								TLS 1.3 End-to-End
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right column: hero image */}
			<div className='relative hidden flex-1 lg:block'>
				<img
					src='https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1908&q=80'
					alt='Cisco ACI rack in datacenter'
					className='absolute inset-0 h-full w-full object-cover'
				/>
			</div>
		</div>
	);
}
