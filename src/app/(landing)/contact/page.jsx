import {
	ChatBubbleLeftRightIcon,
	ClockIcon,
	CreditCardIcon,
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
	QuestionMarkCircleIcon,
	ServerIcon,
} from '@heroicons/react/24/outline';

const contactMethods = [
	{
		name: 'Live Chat',
		description:
			'Get instant help with bookings, billing, and technical questions',
		icon: ChatBubbleLeftRightIcon,
		contact: 'Available 24/7',
		href: '#chat',
		cta: 'Start chat',
	},
	{
		name: 'Email Support',
		description: 'Detailed technical assistance and account management',
		icon: EnvelopeIcon,
		contact: 'support@acirackrentals.com',
		href: 'mailto:support@acirackrentals.com',
		cta: 'Send email',
	},
	{
		name: 'Phone Support',
		description: 'Direct line for urgent rack issues and enterprise sales',
		icon: PhoneIcon,
		contact: '+1 (555) 123-RACK',
		href: 'tel:+15551237225',
		cta: 'Call now',
	},
];

const faqCategories = [
	{
		name: 'Getting Started',
		icon: QuestionMarkCircleIcon,
		questions: [
			'How quickly can I spin up a rack?',
			'What ACI images are available?',
			'Do I need a VPN to access consoles?',
		],
	},
	{
		name: 'Billing & Tokens',
		icon: CreditCardIcon,
		questions: [
			'How does token billing work?',
			'Can I pause a session mid-lab?',
			'Do unused tokens expire?',
		],
	},
	{
		name: 'Technical Support',
		icon: ServerIcon,
		questions: [
			'Can I take snapshots of my config?',
			'How do I invite team members?',
			'What happens to my data after booking ends?',
		],
	},
];

const offices = [
	{
		city: 'San Francisco',
		address: ['123 Network Drive', 'Suite 500', 'San Francisco, CA 94105'],
		timezone: 'PST',
	},
	{
		city: 'Austin',
		address: ['456 Data Center Blvd', 'Floor 3', 'Austin, TX 78701'],
		timezone: 'CST',
	},
	{
		city: 'London',
		address: ['789 Cloud Street', 'Level 12', 'London EC2A 4DP, UK'],
		timezone: 'GMT',
	},
];

export default function Contact() {
	return (
		<div className='bg-white'>
			{/* Hero Section */}
			<div className='relative isolate bg-gradient-to-br from-indigo-50 to-white'>
				{/* Background decoration */}
				<div
					aria-hidden='true'
					className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
					<div
						className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
					/>
				</div>

				<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl'>
							Get in touch
						</h1>
						<p className='mt-6 text-lg leading-8 text-gray-600'>
							Need help with your ACI lab? Have questions about rack
							availability or token pricing? Our team is here to get you back to
							testing faster.
						</p>
					</div>
				</div>
			</div>

			{/* Contact Methods */}
			<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:mx-0'>
					<h2 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
						Choose your preferred way to connect
					</h2>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Whether you need instant help or prefer detailed email support,
						we've got multiple channels to ensure you get the assistance you
						need.
					</p>
				</div>

				<div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
					{contactMethods.map((method) => (
						<div
							key={method.name}
							className='group relative rounded-2xl bg-white p-8 shadow ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-300/60'>
							<div className='flex items-center gap-4'>
								<span className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white'>
									<method.icon className='h-6 w-6' aria-hidden='true' />
								</span>
								<div>
									<h3 className='text-lg font-semibold text-gray-900'>
										{method.name}
									</h3>
									<p className='text-sm text-gray-600'>{method.contact}</p>
								</div>
							</div>
							<p className='mt-4 text-gray-700'>{method.description}</p>
							<a
								href={method.href}
								className='mt-6 inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
								{method.cta}
								<span aria-hidden='true' className='ml-2'>
									→
								</span>
							</a>
						</div>
					))}
				</div>
			</div>

			{/* Contact Form */}
			<div className='bg-gray-50 py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:mx-0'>
						<h2 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
							Send us a message
						</h2>
						<p className='mt-6 text-lg leading-8 text-gray-600'>
							Fill out the form below and we'll get back to you within 24 hours.
							For urgent rack issues, please use live chat or call us directly.
						</p>
					</div>

					<form className='mx-auto mt-16 max-w-2xl'>
						<div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
							<div>
								<label
									htmlFor='first-name'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									First name
								</label>
								<div className='mt-2.5'>
									<input
										type='text'
										name='first-name'
										id='first-name'
										autoComplete='given-name'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor='last-name'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									Last name
								</label>
								<div className='mt-2.5'>
									<input
										type='text'
										name='last-name'
										id='last-name'
										autoComplete='family-name'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
							<div className='sm:col-span-2'>
								<label
									htmlFor='email'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									Email address
								</label>
								<div className='mt-2.5'>
									<input
										type='email'
										name='email'
										id='email'
										autoComplete='email'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
							<div className='sm:col-span-2'>
								<label
									htmlFor='company'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									Company (optional)
								</label>
								<div className='mt-2.5'>
									<input
										type='text'
										name='company'
										id='company'
										autoComplete='organization'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
							<div className='sm:col-span-2'>
								<label
									htmlFor='subject'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									Subject
								</label>
								<div className='mt-2.5'>
									<select
										name='subject'
										id='subject'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
										<option>General Inquiry</option>
										<option>Technical Support</option>
										<option>Billing Question</option>
										<option>Enterprise Sales</option>
										<option>Partnership Opportunity</option>
										<option>Bug Report</option>
									</select>
								</div>
							</div>
							<div className='sm:col-span-2'>
								<label
									htmlFor='message'
									className='block text-sm font-semibold leading-6 text-gray-900'>
									Message
								</label>
								<div className='mt-2.5'>
									<textarea
										name='message'
										id='message'
										rows={6}
										placeholder='Tell us about your ACI lab requirements, any issues you&#039;re experiencing, or how we can help...'
										className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
						</div>
						<div className='mt-10'>
							<button
								type='submit'
								className='block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
								Send message
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* FAQ Section */}
			<div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:mx-0'>
					<h2 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
						Frequently asked questions
					</h2>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Quick answers to common questions about ACI rack rentals, billing,
						and platform features.
					</p>
				</div>

				<div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
					{faqCategories.map((category) => (
						<div
							key={category.name}
							className='rounded-2xl bg-white p-8 shadow ring-1 ring-gray-200'>
							<div className='flex items-center gap-3 mb-6'>
								<span className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100'>
									<category.icon
										className='h-5 w-5 text-indigo-600'
										aria-hidden='true'
									/>
								</span>
								<h3 className='text-lg font-semibold text-gray-900'>
									{category.name}
								</h3>
							</div>
							<ul className='space-y-3'>
								{category.questions.map((question) => (
									<li key={question}>
										<a
											href='#'
											className='text-sm text-gray-600 hover:text-indigo-600 transition-colors'>
											{question}
										</a>
									</li>
								))}
							</ul>
							<a
								href='/faq'
								className='mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500'>
								View all {category.name.toLowerCase()} FAQs
								<span aria-hidden='true' className='ml-1'>
									→
								</span>
							</a>
						</div>
					))}
				</div>
			</div>

			{/* Office Locations */}
			<div className='bg-gray-50 py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:mx-0'>
						<h2 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl'>
							Our locations
						</h2>
						<p className='mt-6 text-lg leading-8 text-gray-600'>
							ACI Rack Rentals operates data centers and support teams across
							multiple time zones to provide 24/7 coverage for your critical lab
							work.
						</p>
					</div>

					<div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
						{offices.map((office) => (
							<div
								key={office.city}
								className='rounded-2xl bg-white p-8 shadow ring-1 ring-gray-200'>
								<div className='flex items-center gap-3 mb-4'>
									<MapPinIcon
										className='h-6 w-6 text-indigo-600'
										aria-hidden='true'
									/>
									<h3 className='text-lg font-semibold text-gray-900'>
										{office.city}
									</h3>
									<span className='text-sm text-gray-500'>
										({office.timezone})
									</span>
								</div>
								<address className='not-italic text-gray-600'>
									{office.address.map((line, index) => (
										<div key={index}>{line}</div>
									))}
								</address>
								<div className='mt-4 flex items-center gap-2'>
									<ClockIcon
										className='h-4 w-4 text-gray-400'
										aria-hidden='true'
									/>
									<span className='text-sm text-gray-600'>
										24/7 Support Coverage
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Emergency Support Banner */}
			<div className='bg-red-50 border-l-4 border-red-400 p-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center'>
						<div className='flex-shrink-0'>
							<PhoneIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
						</div>
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-red-800'>
								Production outage or critical rack failure?
							</h3>
							<div className='mt-1 text-sm text-red-700'>
								Call our emergency line for immediate assistance:
								<a
									href='tel:+15551239999'
									className='font-semibold underline ml-1'>
									+1 (555) 123-9999
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
