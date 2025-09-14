const features = [
	{
		name: 'Production-grade hardware',
		description:
			'Enterprise Nexus leaf-and-spine switches with dedicated APIC controllers—exactly what you’ll find in modern DCs.',
	},
	{
		name: 'Instant self-service booking',
		description:
			'Reserve a slot in under 60 seconds; no emails, no wait-list. Calendar sync and optional webhook alerts included.',
	},
	{
		name: 'Multi-version ACI images',
		description:
			'Boot any rack on 5.2 (1g), 6.0 (3c) or 6.0 (4j) to test upgrades and feature differences side by side.',
	},
	{
		name: 'Clean-wipe & snapshot',
		description:
			'One-click fabric reset between sessions or create full snapshots you can roll back to during a long POC.',
	},
	{
		name: 'L3-Out ready',
		description:
			'Pre-cabled external ports for OSPF, BGP, or static routing—perfect for hybrid-cloud and DR simulations.',
	},
	{
		name: '24×7 remote power control',
		description:
			'Hard-reboot any node from the portal. No ticket needed, no midnight phone calls.',
	},
];

export default function MoreDetails() {
	return (
		<div className='bg-white'>
			<section aria-labelledby='features-heading' className='relative'>
				{/* ––– Hero or topology image ––– */}
				<img
					src='https://images.unsplash.com/photo-1564457461758-8ff96e439e83?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
					alt='Topology diagram of the Single-Pod rack: two Leaf switches, one Spine, and an APIC controller.'
					className='aspect-3/2 w-full object-cover sm:aspect-5/2 lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-16'
				/>

				{/* ––– Copy block ––– */}
				<div className='mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 sm:pb-32 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-32'>
					<div className='lg:col-start-2'>
						<h2
							id='features-heading'
							className='uppercase tracking-wider text-indigo-600 font-semibold mb-2'>
							Single-Pod Rack
						</h2>
						<p className='mt-4 text-4xl font-bold tracking-tight text-gray-900'>
							Built for serious lab work
						</p>
						<p className='mt-4 text-gray-500'>
							Validate configs, rehearse upgrades, or crash-course for the DCACI
							exam— all on real Cisco&nbsp;ACI hardware without the overhead of
							a physical lab.
						</p>

						<dl className='mt-10 grid grid-cols-1 gap-x-8 gap-y-10 text-sm sm:grid-cols-2'>
							{features.map(({ name, description }) => (
								<div key={name}>
									<dt className='font-medium text-gray-900'>{name}</dt>
									<dd className='mt-2 text-gray-500'>{description}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>
		</div>
	);
}
