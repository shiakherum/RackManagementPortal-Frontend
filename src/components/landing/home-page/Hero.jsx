import Link from 'next/link';

export default function Hero() {
	return (
		<div className='bg-white'>
			<div className='relative isolate px-6 lg:px-8'>
				<div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
					/>
				</div>
				<div className='mx-auto max-w-4xl py-32 sm:py-48 lg:py-56'>
					<div className='hidden sm:mb-8 sm:flex sm:justify-center'>
						<div className='relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
							Free ACI Rack Simulator.{' '}
							<a href='#' className='font-semibold text-indigo-600'>
								<span className='absolute inset-0' />
								Learn more <span>&rarr;</span>
							</a>
						</div>
					</div>
					<div className='text-left sm:text-center'>
						<h1 className='text-5xl font-semibold tracking-tighter text-balance text-gray-900 sm:text-7xl'>
							Practice Cisco ACI Like a Pro - On Real Hardware
						</h1>
						<div className='max-w-2xl m-auto'>
							<p className='mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
								Get hands-on access to dedicated Cisco ACI lab environments —
								perfect for engineers, students, and teams preparing for
								production deployments, certifications, or proofs of concept.
							</p>
						</div>
						<div className='mt-10 flex items-center justify-start sm:justify-center gap-x-6'>
							<Link
								href='/racks'
								className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
								View all ACI Racks
							</Link>
							<Link
								href='/poc-solution-testing'
								className='text-sm/6 font-semibold text-gray-900'>
								POC Solution Testing <span>→</span>
							</Link>
						</div>
					</div>
				</div>
				<div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
					/>
				</div>
			</div>
		</div>
	);
}
