import {
	ArrowPathIcon,
	CloudArrowUpIcon,
	Cog6ToothIcon,
	FingerPrintIcon,
	LockClosedIcon,
	ServerIcon,
} from '@heroicons/react/20/solid';

/* rack-specific feature bullets */
const features = [
	{
		name: 'Rapid rack spin-up',
		description:
			'Book a slot and have a clean fabric online in <5 minutes—no image juggling or cabling.',
		icon: CloudArrowUpIcon,
	},
	{
		name: 'Snapshot & Revert',
		description:
			'Take unlimited snapshots and roll back in seconds when a config goes sideways.',
		icon: ArrowPathIcon,
	},
	{
		name: 'Remote console suite',
		description:
			'WebSSH, VNC, Telnet, and HTTPS APIC GUI—reach every node without a VPN.',
		icon: ServerIcon,
	},
	{
		name: 'Token-based billing',
		description:
			'Only pay for hours you lab. Pause anytime and keep unused tokens forever.',
		icon: Cog6ToothIcon,
	},
	{
		name: 'Role-based access',
		description:
			'Invite teammates; grant read-only, operator, or full admin per session.',
		icon: LockClosedIcon,
	},
	{
		name: 'Audit-grade logging',
		description:
			'Every power cycle, image swap, and console login is recorded for compliance.',
		icon: FingerPrintIcon,
	},
];

export default function POCSolutionTesting() {
	return (
		<div className='relative isolate overflow-hidden bg-white py-20'>
			{/* ───────── Blurred blob (unchanged) ───────── */}
			<div
				aria-hidden='true'
				className='absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56'>
				<div
					className='aspect-801/1036 w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30'
					style={{
						clipPath:
							'polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)',
					}}
				/>
			</div>

			{/* ───────── Top copy ───────── */}
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:mx-0'>
					<p className='text-base font-semibold leading-7 text-indigo-600'>
						POC &amp; Solution Testing
					</p>
					<h1 className='mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Validate your design before it hits production
					</h1>
					<p className='mt-6 text-xl leading-8 text-gray-700'>
						Spin up full Cisco&nbsp;ACI fabrics, rehearse upgrades, and prove
						multi-tenant policies on hardware that feels just like your
						data-center spine-leaf—minus the wiring closet.
					</p>
				</div>

				{/* ───────── Quote + longform ───────── */}
				<div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12'>
					{/* quote block */}
					<div className='relative lg:order-last lg:col-span-5'>
						<figure className='border-l border-indigo-600 pl-8'>
							<blockquote className='text-xl font-semibold leading-8 tracking-tight text-gray-900'>
								<p>
									“We cut our ACI migration timeline in half by rehearsing every
									step on this platform. The snapshot feature saved us hours of
									rebuilds after ‘creative’ policy tests.”
								</p>
							</blockquote>
							<figcaption className='mt-8 flex gap-x-4'>
								<img
									src='https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
									alt=''
									className='mt-1 h-10 w-10 flex-none rounded-full bg-gray-50'
								/>
								<div className='text-sm leading-6'>
									<div className='font-semibold text-gray-900'>Priya Menon</div>
									<div className='text-gray-600'>
										Network Architect, CloudSpire
									</div>
								</div>
							</figcaption>
						</figure>
					</div>

					{/* longform text */}
					<div className='max-w-xl text-base leading-7 text-gray-700 lg:col-span-7'>
						<p>
							Our automation powers up a clean fabric, loads your preferred ACI
							image, and exposes secure WebSSH &amp; VNC endpoints in minutes.
							Need to test an upgrade path or simulate a switch failure? One
							click in the dashboard, and you’re back at a known-good snapshot.
						</p>
						<ul role='list' className='mt-8 max-w-xl space-y-8'>
							<li className='flex gap-x-3'>
								<CloudArrowUpIcon
									className='h-5 w-5 flex-none text-indigo-600'
									aria-hidden='true'
								/>
								<span>
									<strong className='font-semibold text-gray-900'>
										Zero-touch deploy.
									</strong>{' '}
									Book, power on, and get APIC credentials in{' '}
									<em>&lt; 5 min</em>.
								</span>
							</li>
							<li className='flex gap-x-3'>
								<ArrowPathIcon
									className='h-5 w-5 flex-none text-indigo-600'
									aria-hidden='true'
								/>
								<span>
									<strong className='font-semibold text-gray-900'>
										Unlimited snapshots.
									</strong>{' '}
									Iteration without fear—roll back anytime.
								</span>
							</li>
							<li className='flex gap-x-3'>
								<LockClosedIcon
									className='h-5 w-5 flex-none text-indigo-600'
									aria-hidden='true'
								/>
								<span>
									<strong className='font-semibold text-gray-900'>
										Encrypted tunnels.
									</strong>{' '}
									No VPN; all console traffic is TLS-wrapped.
								</span>
							</li>
						</ul>
						<p className='mt-8'>
							When the proof is done, our wipe script erases every tenant, key,
							and log, guaranteeing the next engineer gets a pristine fabric.
						</p>

						<h2 className='mt-16 text-2xl font-bold tracking-tight text-gray-900'>
							Automate every step
						</h2>
						<p className='mt-6'>
							REST and GraphQL endpoints let you integrate rack provisioning
							into CI/CD pipelines, so every pull request spins up its own
							isolated fabric for integration tests.
						</p>
					</div>
				</div>
			</div>

			{/* ───────── Feature grid ───────── */}
			<div className='mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-32 lg:px-8'>
				<p className='mb-20 max-w-2xl text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl'>
					Everything you need for a successful POC
				</p>
				<dl className='mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16'>
					{features.map((feature) => (
						<div key={feature.name} className='relative pl-9'>
							<feature.icon
								className='absolute left-1 top-1 h-5 w-5 text-indigo-600'
								aria-hidden='true'
							/>
							<dt className='inline font-semibold text-gray-900'>
								{feature.name}
							</dt>{' '}
							<dd className='inline'>{feature.description}</dd>
						</div>
					))}
				</dl>
			</div>

			{/* ───────── CTA banner ───────── */}
			<div className='bg-white'>
				<div className='mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 sm:pb-0 lg:px-8'>
					<div className='relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16'>
						<h2 className='text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
							Launch your ACI POC today
						</h2>
						<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300'>
							Create a free account, top up tokens, and reserve a rack in under
							five minutes. Real hardware, no long-term contracts.
						</p>
						<div className='mt-10 flex items-center justify-center gap-x-6'>
							<a
								href='/signin'
								className='rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
								Get started
							</a>
							<a
								href='/contact'
								className='text-sm font-semibold text-white hover:text-gray-300'>
								Talk to sales&nbsp;→
							</a>
						</div>

						{/* blob */}
						<svg
							viewBox='0 0 1024 1024'
							aria-hidden='true'
							className='absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]'>
							<circle
								cx={512}
								cy={512}
								r={512}
								fill='url(#poctest-gradient)'
								fillOpacity='0.7'
							/>
							<defs>
								<radialGradient id='poctest-gradient'>
									<stop stopColor='#7775D6' />
									<stop offset={1} stopColor='#E935C1' />
								</radialGradient>
							</defs>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
