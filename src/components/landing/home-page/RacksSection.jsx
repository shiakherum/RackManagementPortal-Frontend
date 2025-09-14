/* ---------- imports ---------- */
import {
	AdjustmentsHorizontalIcon,
	BuildingLibraryIcon,
	CheckCircleIcon,
	CpuChipIcon,
	EllipsisHorizontalIcon,
	GlobeAltIcon,
	ServerStackIcon,
	SquaresPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const racks = [
	{
		id: 'acisim',
		title: 'ACISIM Pod',
		tagline: 'ACI simulator (VMware)',
		tokens: 0,
		stats: { nodes: 'Sim', tokenTxt: 'Free' },
		specs: [
			'Simulator v5.x',
			'Zero physical hardware',
			'Ideal for CCNP / DCACI',
			'Up to 2 h per session',
		],
		cta: { primary: 'Launch', href: '/racks/acisim' },
		icon: CpuChipIcon,
	},
	{
		id: 'single',
		title: 'Single Pod',
		tagline: '2 Leafs · 1 Spine · 1 APIC',
		tokens: 25,
		stats: { nodes: '4 Nodes', tokenTxt: '25 Tokens / h' },
		specs: [
			'L3-Out (OSPF/BGP)',
			'VPN jump host included',
			'Console + GUI access',
		],
		cta: { primary: 'Book Now', href: '/racks/single' },
		icon: ServerStackIcon,
	},
	{
		id: 'large',
		title: 'Large Single Pod',
		tagline: '3 Leafs · 2 Spines · 3 APICs',
		tokens: 40,
		stats: { nodes: '8 Nodes', tokenTxt: '40 Tokens / h' },
		specs: [
			'Multi-tenant labs',
			'Multicast & QoS demos',
			'Maps 1-to-1 with prod',
		],
		cta: { primary: 'Book Now', href: '/racks/large' },
		icon: SquaresPlusIcon,
	},
	{
		id: 'multipod',
		title: 'Multipod',
		tagline: '2 Pods, shared APICs',
		tokens: 60,
		stats: { nodes: '10 Nodes', tokenTxt: '60 Tokens / h' },
		specs: [
			'Inter-POD latency <1 ms',
			'Stretched-fabric labs',
			'24×7 booking slots',
		],
		cta: { primary: 'Book Now', href: '/racks/multipod' },
		icon: GlobeAltIcon,
	},
	{
		id: 'multisite',
		title: 'Multisite',
		tagline: '2 Sites, MSO ready',
		tokens: 80,
		stats: { nodes: '12 Nodes', tokenTxt: '80 Tokens / h' },
		specs: [
			'WAN emulation built-in',
			'Perfect for DR drills',
			'24×7 booking slots',
		],
		cta: { primary: 'Book Now', href: '/racks/multisite' },
		icon: BuildingLibraryIcon,
	},
	{
		id: 'custom',
		title: 'Custom Pod',
		tagline: 'Your topology, your rules',
		tokens: 0,
		stats: { nodes: 'Customizable', tokenTxt: 'Quote' },
		specs: [
			'Any leaf / spine count',
			'Add compute & services',
			'Priority expert support',
		],
		cta: { primary: 'Request Quote', href: '/racks/custom' },
		icon: AdjustmentsHorizontalIcon,
	},
];

export default function RackCards() {
	return (
		<section className='px-6 lg:py-32 lg:pt-24 bg-gradient-to-b from-white to-gray-100'>
			<div className='mx-auto max-w-2xl md:max-w-7xl sm:px-8'>
				<div>
					<h6 className='uppercase tracking-wider text-gray-400 font-semibold mb-2'>
						Our Racks
					</h6>
					<h2 className='relative z-20 text-4xl font-semibold tracking-tight text-pretty text-gray-950 data-dark:text-white sm:text-5xl'>
						Enterprise-grade ACI labs, on demand.
					</h2>
					<p className='text-2xl font-medium text-gray-500 mt-6 max-w-3xl mb-10'>
						Rent a fully-featured Cisco&nbsp;ACI rack in minutes, pay with
						flexible tokens, and practice exactly what you’ll deploy in
						production.
					</p>
					<Link
						href='/racks'
						className='rounded-md bg-indigo-600 px-8.5 py-2.5 text font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
						See all Racks
					</Link>
				</div>
				<div className='mt-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-20'>
					{racks.map(
						({ id, title, tagline, stats, specs, cta, icon: Icon }) => (
							<article
								key={id}
								className='group flex flex-col rounded-2xl bg-white shadow ring-1 ring-gray-200 transition
                         hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-300/60'>
								{/* header row */}
								<div className='flex items-start justify-between p-7'>
									<div className='flex items-center gap-3'>
										{/* gradient splash circle */}
										<span
											className='flex h-10 w-10 items-center justify-center rounded-full
                                   bg-gradient-to-r from-indigo-500 to-violet-600
                                   text-white transition group-hover:from-indigo-500 group-hover:to-violet-500'>
											<Icon className='h-5 w-5' aria-hidden />
										</span>
										{/* <Icon className='h-6 w-6 text-indigo-500' aria-hidden /> */}
										<div>
											<h3 className='text-base font-semibold text-gray-900'>
												{title}
											</h3>
											<p className='text-sm text-gray-500'>{tagline}</p>
										</div>
									</div>
									<EllipsisHorizontalIcon
										className='h-5 w-5 text-gray-400'
										aria-hidden
									/>
								</div>

								{/* metric row */}
								<div className='grid grid-cols-2 gap-4 px-7 pb-5'>
									<div>
										<p className='text-xs font-medium text-gray-500'>
											Hardware
										</p>
										<p className='text-xl font-semibold text-gray-900'>
											{stats.nodes}
										</p>
									</div>
									<div className='text-right'>
										<p className='text-xs font-medium text-gray-500'>Price</p>
										<p className='text-lg tracking-tight font-semibold text-emerald-600'>
											{stats.tokenTxt}
										</p>
									</div>
								</div>

								{/* divider */}
								<div className='h-px bg-gray-100' />

								{/* spec list */}
								<ul className='flex-1 space-y-1 px-7 py-5 text-sm text-gray-700'>
									{specs.map((s, i) => (
										<li key={i} className='flex gap-2'>
											<CheckCircleIcon
												className='h-4 w-4 text-indigo-500'
												aria-hidden
											/>
											<span>{s}</span>
										</li>
									))}
								</ul>

								{/* divider */}
								<div className='h-px bg-gray-100' />

								{/* CTA buttons */}
								<div className='flex gap-3 px-7 py-6 bg-gray-50 rounded-bl-2xl rounded-br-2xl'>
									<a
										href={`/racks/${id}`}
										className='flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'>
										More Details
									</a>
									<a
										href={cta.href}
										className='flex-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500'>
										{cta.primary}
									</a>
								</div>
							</article>
						)
					)}
				</div>
			</div>
		</section>
	);
}
