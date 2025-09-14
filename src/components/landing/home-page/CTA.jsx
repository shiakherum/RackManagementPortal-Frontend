import Link from 'next/link';

export default function CTA() {
	return (
		<div className='bg-white'>
			<div className='px-6 py-24 sm:px-6 sm:py-32 sm:pt-4 lg:px-8'>
				<div className='mx-auto max-w-5xl text-center'>
					<h2 className='text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-5xl'>
						Ready to lab on real Cisco&nbsp;ACI hardware?
					</h2>
					<p className='mx-auto mt-6 leading-relaxed max-w-xl text-lg/8 text-pretty text-gray-600'>
						Create your free account, grab a token pack, and book a rack in
						under&nbsp;5&nbsp;minutes—no long-term contracts, no hidden fees.
					</p>
					<div className='mt-10 flex items-center justify-center gap-x-6'>
						<Link
							href='/signin'
							className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
							Create free account
						</Link>
						<Link
							href='/racks'
							className='text-sm/6 font-semibold text-gray-900'>
							Browse Racks <span aria-hidden='true'>→</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
