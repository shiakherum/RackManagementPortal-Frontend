import {
	ArrowPathIcon,
	CloudArrowUpIcon,
	Cog6ToothIcon,
	FingerPrintIcon,
	LockClosedIcon,
	ServerIcon,
} from '@heroicons/react/20/solid'; // (icons not used here but keep if needed)

const stats = [
	{ label: 'Racks online', value: '48' },
	{ label: 'POCs delivered', value: '2.4K' },
	{ label: 'Avg. spin-up time', value: '4 min' },
];

const values = [
	{
		name: 'Real hardware, real results',
		description:
			'Every lab runs on production-grade Cisco leaf, spine, and APIC nodes—no simulators, no compromises. What you test here behaves exactly like your data-center fabric.',
	},
	{
		name: 'Automation first',
		description:
			'From power-on to clean wipe, our pipeline handles imaging, cabling, and snapshots so you spend time validating design—not waiting on gear.',
	},
	{
		name: 'Zero vendor bias',
		description:
			'We host vanilla images straight from Cisco TAC and let you load your own tools. Results are yours; we don’t gate features behind a paywall.',
	},
	{
		name: 'Security & privacy',
		description:
			'Isolated VLANs, TLS-only console endpoints, and auto-wipe scripts ensure your configs, keys, and logs are gone the moment your booking ends.',
	},
	{
		name: 'Community-driven learning',
		description:
			'We publish reference topologies and share-play videos so every engineer can level up, not just the ones with big hardware budgets.',
	},
	{
		name: 'Fair, transparent pricing',
		description:
			'Our token model charges by the hour—pause anytime, never lose unused balance, and see exactly where every token goes.',
	},
];

export default function About() {
	return (
		<div className='bg-white'>
			<main className='isolate'>
				{/* ------------- Hero spacer (pattern background kept) ------------ */}
				<div className='relative isolate -z-10'>
					{/* SVG pattern unchanged */}
					<svg
						aria-hidden='true'
						className='absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]'>
						<defs>
							<pattern
								id='grid-pattern'
								width={200}
								height={200}
								x='50%'
								y={-1}
								patternUnits='userSpaceOnUse'>
								<path d='M.5 200V.5H200' fill='none' />
							</pattern>
						</defs>
						<svg x='50%' y={-1} className='overflow-visible fill-gray-50'>
							<path
								d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z'
								strokeWidth={0}
							/>
						</svg>
						<rect
							width='100%'
							height='100%'
							fill='url(#grid-pattern)'
							strokeWidth={0}
						/>
					</svg>

					{/* top blur blob (kept) */}
					<div
						aria-hidden='true'
						className='absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48'>
						<div
							className='aspect-801/1036 w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30'
							style={{
								clipPath:
									'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
							}}
						/>
					</div>

					{/* hero spacer */}
					<div className='overflow-hidden'>
						<div className='mx-auto max-w-7xl px-6 pt-24' />
					</div>
				</div>

				{/* ------------- About copy ------------- */}
				<div className='mx-auto mt-44 max-w-7xl px-6 lg:px-8 sm:mt-0'>
					<div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-none'>
						<h2 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
							About&nbsp;ACI&nbsp;Rack&nbsp;Rentals
						</h2>

						<div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
							{/* left column text */}
							<div className='lg:w-full lg:max-w-2xl lg:flex-auto'>
								<p className='text-xl leading-8 text-gray-600'>
									We started ACI&nbsp;Rack&nbsp;Rentals to put enterprise-grade
									hardware in the hands of every engineer—no colo contract or
									six-figure budget required. Our fully automated lab platform
									lets you validate designs, rehearse upgrades, and ace
									certifications on the exact gear you’ll run in prod.
								</p>
								<p className='mt-10 max-w-xl text-base leading-7 text-gray-700'>
									Each reservation powers up a clean fabric, loads your chosen
									ACI image, and exposes secure console endpoints within
									minutes. When your session ends, a cryptographic wipe destroys
									configs and logs, ensuring complete isolation for the next
									user.
								</p>
							</div>

							{/* stats */}
							<div className='lg:flex lg:flex-auto lg:justify-center'>
								<dl className='w-64 space-y-8 xl:w-80'>
									{stats.map((stat) => (
										<div
											key={stat.label}
											className='flex flex-col-reverse gap-y-4'>
											<dt className='text-base leading-7 text-gray-600'>
												{stat.label}
											</dt>
											<dd className='text-5xl font-semibold tracking-tight text-gray-900'>
												{stat.value}
											</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
					</div>
				</div>

				{/* ------------- Hero image ------------- */}
				<div className='mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8'>
					<img
						src='https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1500&q=80'
						alt='Engineer configuring an ACI lab remotely'
						className='aspect-5/2 w-full object-cover xl:rounded-3xl'
					/>
				</div>

				{/* ------------- Values grid ------------- */}
				<div className='mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 pb-30'>
					<div className='mx-auto max-w-2xl lg:mx-0'>
						<h2 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
							Our values
						</h2>
						<p className='mt-6 text-lg leading-8 text-gray-600'>
							The principles that guide every feature we build and every rack we
							maintain.
						</p>
					</div>

					<dl className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
						{values.map((value) => (
							<div key={value.name}>
								<dt className='font-semibold text-gray-900'>{value.name}</dt>
								<dd className='mt-1 text-gray-600'>{value.description}</dd>
							</div>
						))}
					</dl>
				</div>
			</main>
		</div>
	);
}
