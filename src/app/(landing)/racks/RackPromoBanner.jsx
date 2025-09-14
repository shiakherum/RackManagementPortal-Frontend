import { XMarkIcon } from '@heroicons/react/20/solid';

export default function RackPromoBanner() {
	return (
		<div className='relative isolate flex items-center gap-x-6 overflow-hidden bg-indigo-800 px-6 py-2.5 sm:px-3.5 sm:before:flex-1'>
			{/* decorative blobs (unchanged) */}

			{/* promo text + CTA */}
			<div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
				<p className='text-sm leading-6 text-white'>
					<strong className='font-semibold'>RackFest Flash Bonus</strong>
					<svg
						viewBox='0 0 2 2'
						aria-hidden='true'
						className='mx-2 inline h-0.5 w-0.5 fill-current'>
						<circle cx={1} cy={1} r={1} />
					</svg>
					Get{' '}
					<span className='font-semibold text-indigo-100 underline underline-offset-4'>
						20% extra tokens
					</span>{' '}
					on any pack—this week only.
				</p>
				<a
					href='/token-packs'
					className='flex-none rounded-full bg-gray-200 px-3.5 py-1 text-sm font-semibold text-indigo-950 shadow hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'>
					Grab tokens&nbsp;&rarr;
				</a>
			</div>

			{/* dismiss button */}
			<div className='flex flex-1 justify-end'></div>
		</div>
	);
}
