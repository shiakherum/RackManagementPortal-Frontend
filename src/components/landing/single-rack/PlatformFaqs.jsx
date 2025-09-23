import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

const faqs = [
	{
		question: 'How long does it take to spin up a rack after I book?',
		answer:
			'Under normal load, a fresh fabric is powered on, image-checked, and reachable in less than five minutes. You’ll receive an email and Slack/Teams webhook when the APIC is ready.',
	},
	{
		question: 'What connection methods are supported?',
		answer:
			'Every rack exposes SSH and Telnet for CLI, WebSSH for in-browser terminals, VNC for out-of-band console, and HTTPS for the APIC GUI. No VPN is required; traffic is tunneled over TLS.',
	},
	{
		question: 'Can I switch ACI versions during my session?',
		answer:
			'Yes. Each rack comes with multiple golden images (5.x and 6.x). Use the “Change Image” action in the dashboard—our automation reboots the fabric with your chosen version in ~12 min.',
	},
	{
		question: 'What happens if I run out of tokens mid-lab?',
		answer:
			'You’ll see low-balance alerts at 15 min and 5 min. If tokens reach zero, the rack pauses (state saved) for one hour, giving you time to top-up and resume without losing progress.',
	},
	{
		question: 'Is my configuration wiped after the booking?',
		answer:
			'Yes. A secure wipe script removes tenants, policies, keys, and logs. Snapshots you created manually remain available in your account for 30 days.',
	},
	{
		question: 'Can multiple team members share the same rack?',
		answer:
			'Absolutely. Invite up to 5 collaborators per booking at no extra cost. Each collaborator gets their own WebSSH and VNC session with role-based access.',
	},
	{
		question: 'Do tokens expire?',
		answer:
			'No. Purchased tokens sit in your wallet indefinitely. They’re only deducted when an active rack is running or when you consume premium add-ons like extended snapshot storage.',
	},
	{
		question: 'How do I extend my session or cancel early?',
		answer:
			'Click “Extend” in the booking panel before your slot ends to add hours instantly (tokens apply). To cancel, hit “End Now”—unused whole-hour increments are automatically refunded.',
	},
];

export default function PlatformFaqs({ rack }) {
	return (
		<div className='bg-gray-100'>
			<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					<div className='max-w-2xl'>
						<h2
							id='faq-heading'
							className='uppercase tracking-wider text-gray-400 font-semibold mb-2'>
							Rack Rental FAQs
						</h2>
						<p className='mt-4 text-4xl font-bold tracking-tight text-gray-900'>
							Everything you need to know
						</p>
						<p className='mt-4 text-gray-500'>
							From booking windows and token billing to remote console options,
							here are the most common questions customers ask before they spin
							up an ACI lab.
						</p>
					</div>

					<dl className='mt-16 divide-y divide-gray-900/10'>
						{faqs.map((faq) => (
							<Disclosure
								key={faq.question}
								as='div'
								className='py-6 first:pt-0 last:pb-0'>
								<dt>
									<DisclosureButton className='group flex w-full items-start justify-between text-left text-gray-900'>
										<span className='text-base font-semibold leading-7'>
											{faq.question}
										</span>
										<span className='ml-6 flex h-7 items-center'>
											<PlusSmallIcon
												className='h-6 w-6 group-data-open:hidden'
												aria-hidden='true'
											/>
											<MinusSmallIcon
												className='h-6 w-6 group-not-data-open:hidden'
												aria-hidden='true'
											/>
										</span>
									</DisclosureButton>
								</dt>
								<DisclosurePanel as='dd' className='mt-2 pr-12'>
									<p className='text-base leading-7 text-gray-600'>
										{faq.answer}
									</p>
								</DisclosurePanel>
							</Disclosure>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}
