/* ---------- imports ---------- */
import {
	ChatBubbleOvalLeftEllipsisIcon,
	ClockIcon,
	ComputerDesktopIcon,
	CpuChipIcon,
	CurrencyDollarIcon,
	PowerIcon,
} from '@heroicons/react/24/outline';

const features = [
	{
		name: 'Instant Slot Booking',
		description:
			'Provision a dedicated rack in under five minutes. Pick a time, click “Book,” and the fabric is reserved—no wait-list shuffle.',
		icon: ClockIcon,
	},
	{
		name: 'Pay-As-You-Go Tokens',
		description:
			'Only pay for the exact hours you lab. Our transparent token system keeps costs predictable for teams and individuals alike.',
		icon: CurrencyDollarIcon,
	},
	{
		name: 'Remote Power & Reset',
		description:
			'One-click power cycling and hard resets from the dashboard. Perfect for recovery tests or wiping a messy config.',
		icon: PowerIcon,
	},
	{
		name: 'Live Console & GUI Access',
		description:
			'Browser-based KVM console plus full APIC GUI—no VPN required. Work from anywhere on any device.',
		icon: ComputerDesktopIcon,
	},
	{
		name: 'Multi-Version ACI Images',
		description:
			'Spin up racks on 5.x or 6.x releases for upgrade rehearsals, feature trials, or certification prep.',
		icon: CpuChipIcon,
	},
	{
		name: '24×7 Expert Chat',
		description:
			'Real network engineers on standby to troubleshoot, share best practices, or guide your proof-of-concept.',
		icon: ChatBubbleOvalLeftEllipsisIcon,
	},
];

export default function Features() {
	return (
		<section className='bg-white py-24 sm:py-32 border-t border-b border-gray-200'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto grid max-w-2xl grid-cols-1 gap-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5'>
					<div className='col-span-2 '>
						<h6 className='uppercase tracking-wider text-gray-400 font-semibold mb-2'>
							Our Features
						</h6>
						<h2 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
							Everything you need to lab like production
						</h2>
					</div>

					<dl className='col-span-3 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2'>
						{features.map(({ name, description, icon: Icon }) => (
							<div key={name}>
								<dt className='text-base font-semibold leading-7 text-gray-900'>
									<span className='mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
										<Icon className='h-6 w-6 text-white' aria-hidden='true' />
									</span>
									{name}
								</dt>
								<dd className='mt-1 text-base leading-7 text-gray-600'>
									{description}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
