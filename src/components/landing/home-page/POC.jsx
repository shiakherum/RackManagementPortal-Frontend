export default function POC() {
	return (
		<div className='overflow-hidden bg-white py-24 sm:py-32'>
			<div className='mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8'>
				{/* ───────── Intro ───────── */}
				<div className='max-w-4xl'>
					<h6 className='uppercase tracking-wider text-gray-400 font-semibold mb-2'>
						POC & Solution Testing
					</h6>
					<h1 className='mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Validate ACI designs before production
					</h1>
					<p className='mt-6 text-xl leading-8 text-gray-700'>
						Spin up full-blown Cisco&nbsp;ACI fabrics in minutes, replicate
						real-world topologies, and prove every policy—without touching your
						live network. Our on-demand racks give you the confidence to ship
						faster, safer, and smarter.
					</p>
				</div>

				{/* ───────── Mission + Gallery + Stats ───────── */}
				<section className='mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16'>
					{/* Mission copy */}
					<div className='lg:pr-8'>
						<h2 className='text-2xl font-semibold tracking-tight text-gray-900'>
							Why we built this
						</h2>
						<p className='mt-6 text-base leading-7 text-gray-600'>
							DevOps teams, consultants, and network architects all share a
							common pain: lab time on real hardware is scarce and expensive.
							We’ve automated the boring parts—power, cabling, image loads,
							clean-wipe scripts—so you can focus on proving the business case
							instead of hunting for spare gear.
						</p>
						<p className='mt-8 text-base leading-7 text-gray-600'>
							Whether you’re benchmarking a new multi-pod design, validating an
							upgrade path from 5.x to 6.x, or just need a sandbox for a demo,
							our racks are provisioned, token-metered, and ready whenever
							inspiration (or a customer deadline) strikes.
						</p>
					</div>

					{/* Image masonry */}
					<div className='pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto'>
						<div className='-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8'>
							<div className='aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10'>
								<img
									src='https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&w=560&q=90'
									alt='Top-of-rack switches powering an ACI fabric'
									className='block h-full w-full object-cover'
								/>
							</div>
							<div className='-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40'>
								<img
									src='https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=560&q=90'
									alt='Engineer validating a policy in the APIC GUI'
									className='block h-full w-full object-cover'
								/>
							</div>
							<div className='aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10'>
								<img
									src='https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=560&q=90'
									alt='Token-based billing dashboard'
									className='block h-full w-full object-cover'
								/>
							</div>
							<div className='-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40'>
								<img
									src='https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=560&q=90'
									alt='Remote power-control interface'
									className='block h-full w-full object-cover'
								/>
							</div>
						</div>
					</div>

					{/* Stats */}
					<div className='max-lg:mt-16'>
						<p className='text-base font-semibold leading-7 text-gray-500'>
							By the numbers
						</p>
						<hr className='mt-6 border-t border-gray-200' />
						<dl className='mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2'>
							<div className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4'>
								<dt className='text-sm leading-6 text-gray-600'>
									POCs Delivered
								</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>2.4</span>K
								</dd>
							</div>
							<div className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4'>
								<dt className='text-sm leading-6 text-gray-600'>
									Racks Online
								</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>48</span>
								</dd>
							</div>
							<div className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4 sm:border-b-0 sm:pb-0'>
								<dt className='text-sm leading-6 text-gray-600'>
									Engineers Served
								</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>8.1</span>K
								</dd>
							</div>
							<div className='flex flex-col gap-y-2'>
								<dt className='text-sm leading-6 text-gray-600'>
									Avg. Setup Time
								</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>5</span> min
								</dd>
							</div>
						</dl>
					</div>
				</section>
			</div>
		</div>
	);
}
