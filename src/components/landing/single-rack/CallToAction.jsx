export default function CallToAction() {
	return (
		<div className='bg-indigo-700'>
			<div className='px-6 py-24 sm:px-6 sm:py-32 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					{/* headline */}
					<h2 className='text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
						Ready to lab on a Single-Pod ACI fabric?
					</h2>

					{/* sub-copy */}
					<p className='mx-auto mt-6 max-w-xl text-lg text-indigo-200'>
						Spin up two Leafs, a Spine, and a fully-licensed APIC in under five
						minutes. Perfect for CCNP prep, policy testing, or demoing ACI
						fundamentals—no hardware room required.
					</p>

					{/* CTAs */}
					<div className='mt-10 flex items-center justify-center gap-x-6'>
						<a
							href='/racks/single-pod'
							className='rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
							Book Now
						</a>
						<a
							href='/contact'
							className='text-sm font-semibold text-white hover:text-indigo-200'>
							Contact Sales&nbsp;&rarr;
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
