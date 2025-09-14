import { PlusIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

const tiers = [
	{
		name: 'JumpStart 100',
		description: 'Ideal for weekend labs and certification practice.',
		tokens: 100,
		priceINR: 999,
		href: '#',
		highlights: [
			{ description: 'Instant rack booking' },
			{ description: 'Power-cycle controls' },
			{ description: 'APIC GUI + console access' },
			{ description: '24-hour ticket support', disabled: true },
			{ description: 'Priority chat', disabled: true },
		],
	},
	{
		name: 'ProLab 500',
		description: 'Enough juice for multi-pod proofs of concept.',
		tokens: 500,
		priceINR: 3999,
		href: '#',
		highlights: [
			{ description: 'Instant rack booking' },
			{ description: 'Power-cycle controls' },
			{ description: 'APIC GUI + console access' },
			{ description: '24-hour ticket support' },
			{ description: 'Priority chat', disabled: true },
		],
	},
	{
		name: 'UltraLab 2000',
		description: 'Enterprise capacity for large teams & long POCs.',
		tokens: 2000,
		priceINR: 2500000,
		href: '#',
		highlights: [
			{ description: 'Instant rack booking' },
			{ description: 'Power-cycle controls' },
			{ description: 'APIC GUI + console access' },
			{ description: '24-hour ticket support' },
			{ description: 'Priority chat' },
		],
	},
];

export default function TokenPacks() {
	return (
		<div className='bg-white py-24 sm:py-32'>
			<div className='mx-auto max-w-4xl px-6 max-lg:text-center lg:max-w-7xl lg:px-8'>
				<h1 className='text-5xl font-semibold tracking-tight text-balance text-gray-950 sm:text-6xl lg:text-pretty'>
					Flexible token packs for every project
				</h1>
				<p className='mt-6 max-w-3xl text-lg font-medium text-pretty text-gray-500 max-lg:mx-auto sm:text-xl/8'>
					Buy tokens once, spend them whenever you need lab time—no monthly
					commitment, no hidden fees.
				</p>
			</div>
			<div className='relative pt-16 sm:pt-24'>
				<div className='absolute inset-x-0 top-48 bottom-0 bg-[radial-gradient(circle_at_center_center,#7775D6,#592E71,#030712_70%)] lg:bg-[radial-gradient(circle_at_center_150%,#7775D6,#6366f1,#030712_70%)]' />
				<div className='relative mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8'>
					<div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
						{tiers.map((tier) => (
							<div
								key={tier.name}
								className='relative -m-2 grid w-full max-w-md grid-cols-1 rounded-[2rem] ring-1 ring-black/5 shadow-[inset_0_0_2px_1px_#ffffff4d] sm:mx-auto lg:mx-0'>
								<div className='grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5'>
									<div className='rounded-3xl bg-white p-10 pb-9 ring-1 ring-black/5 shadow-2xl'>
										{/* Tier title */}
										<h2 className='text-lg font-bold text-indigo-600'>
											{tier.name}
										</h2>
										<p className='mt-2 text-sm text-gray-600'>
											{tier.description}
										</p>

										{/* Token + price display */}
										<div className='mt-8 flex items-end gap-4'>
											<div className='text-5xl font-extrabold text-gray-950'>
												<span className='opacity-25'>T</span>
												{tier.tokens}
											</div>
											<div className='text-sm font-medium text-gray-600'>
												<p>Tokens</p>
												<p className='mt-0.5'>
													₹{(tier.priceINR / 100).toFixed(2)}
												</p>
											</div>
										</div>

										{/* CTA */}
										<div className='mt-8'>
											<Link
												href={tier.href}
												className='inline-block w-full rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
												Buy now
											</Link>
										</div>

										{/* Highlights */}
										<div className='mt-8'>
											<h3 className='text-sm font-medium text-gray-950'>
												Includes:
											</h3>
											<ul className='mt-3 space-y-3'>
												{tier.highlights.map(({ description, disabled }) => (
													<li
														key={description}
														className='group flex items-start gap-4 text-sm text-gray-600'>
														<span className='inline-flex h-6 items-center'>
															<PlusIcon
																className={`h-4 w-4 ${
																	disabled ? 'fill-gray-300' : 'fill-gray-400'
																}`}
																aria-hidden='true'
															/>
														</span>
														{disabled && (
															<span className='sr-only'>Not included:</span>
														)}
														<span
															className={
																disabled ? 'text-gray-400' : undefined
															}>
															{description}
														</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className='flex justify-between py-16 opacity-60 max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4 sm:py-10'></div>
				</div>
			</div>
		</div>
	);
}
