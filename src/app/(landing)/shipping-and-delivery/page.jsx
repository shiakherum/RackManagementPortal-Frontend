export default function ShippingAndDelivery() {
	return (
		<div className='bg-white'>
			{/* Hero */}
			<div className='bg-gray-100 py-24 sm:py-32'>
				<div className='mx-auto max-w-4xl px-6 lg:px-8'>
					<h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Shipping, Delivery & Access Policy
					</h1>
					<p className='mt-6 text-base text-gray-600'>
						Effective date:{' '}
						<span className='font-medium text-gray-900'>August 13, 2025</span>
					</p>
					<p className='mt-2 text-sm text-gray-600 leading-relaxed'>
						<span className='font-medium'>ACI Rack Rentals</span> provides a
						fully digital service. We do{' '}
						<span className='font-semibold'>not</span> ship physical goods. All
						purchases (Token Packs) and bookings grant online access to remotely
						hosted ACI lab racks during your scheduled time-slots via{' '}
						<span className='font-medium'>acirackrentals.com</span> (the
						"Site").
					</p>
				</div>
			</div>

			{/* Body */}
			<div className='mx-auto max-w-4xl px-6 lg:px-8 py-16'>
				{/* 1. Scope & Overview */}
				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						1. Scope & Overview
					</h2>
					<p className='text-gray-700'>
						This Policy clarifies how access to our digital Services is
						provisioned and delivered, including booking confirmations, access
						windows, time-zone handling, and related operational details.
						Capitalized terms have the meanings set out in our Terms and
						Conditions.
					</p>
				</section>

				{/* 2. Digital-Only Service (No Physical Shipping) */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						2. Digital-Only Service (No Physical Shipping)
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							We do not ship, courier, or deliver physical products or media.
						</li>
						<li>
							All deliverables are digital: dashboard access, credentials, and
							remote connectivity to your booked rack segment.
						</li>
						<li>
							No shipping charges, customs duties, or import taxes apply to our
							Services.
						</li>
					</ul>
				</section>

				{/* 3. Delivery of Access (How You Receive the Service) */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						3. Delivery of Access (How You Receive the Service)
					</h2>
					<ol className='list-decimal pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Account Creation.</span> Create an
							account on the Site and verify your email. Access to bookings is
							managed through your dashboard.
						</li>
						<li>
							<span className='font-medium'>Token Purchase.</span> Purchase
							Token Packs using an available payment method. Tokens post to your
							account balance after successful payment authorization (typically
							within minutes).
						</li>
						<li>
							<span className='font-medium'>Booking Confirmation.</span> Redeem
							Tokens to reserve a time-slot. You will see the confirmed slot
							instantly in your dashboard and receive an email confirmation (if
							email is verified).
						</li>
						<li>
							<span className='font-medium'>Access Window.</span> At the
							scheduled start time, rack access activates automatically and
							remains available until the end of the booked slot.
						</li>
						<li>
							<span className='font-medium'>Connectivity.</span> Connect to your
							rack using the protocols and endpoints shown in your dashboard
							(e.g., VPN/SSH/HTTPS/console, as applicable). We do not deliver
							software to your premises.
						</li>
					</ol>
				</section>

				{/* 4. Typical Provisioning Timelines */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						4. Typical Provisioning Timelines
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Token crediting: usually immediate after payment authorization. In
							rare cases, allow up to 30 minutes due to payment network latency.
						</li>
						<li>
							Booking confirmation: immediate upon successful token redemption.
						</li>
						<li>
							Rack activation: automatic at the exact scheduled start time of
							your slot.
						</li>
					</ul>
					<p className='text-gray-700'>
						If your tokens or booking do not appear within the above timelines,
						contact{' '}
						<span className='font-medium'>support@acirackrentals.com</span> with
						your order or booking ID.
					</p>
				</section>

				{/* 5. Time Zones & Scheduling */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						5. Time Zones & Scheduling
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							All bookings display the time zone indicated in your dashboard.
							Verify the time zone before confirming a slot.
						</li>
						<li>
							Your access begins and ends strictly at the scheduled times. We
							recommend joining a few minutes early to validate connectivity.
						</li>
					</ul>
				</section>

				{/* 6. Access Credentials & Delivery Failures */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						6. Access Credentials & Delivery Failures
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Ensure your email remains verified and that you can receive
							messages from{' '}
							<span className='font-medium'>acirackrentals.com</span>. Check
							spam/junk folders if confirmations are missing.
						</li>
						<li>
							Dashboard delivery is authoritative: even if emails fail, your
							bookings, endpoints, and passwords are visible in your account
							dashboard.
						</li>
						<li>
							For password resets or access issues, use the Site’s recovery
							options or contact support promptly during your slot.
						</li>
					</ul>
				</section>

				{/* 7. Geographic Availability & Network Requirements */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						7. Geographic Availability & Network Requirements
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Services are delivered over the internet. You are responsible for
							a stable connection and any firewall/VPN rules on your side.
						</li>
						<li>
							Some regions, institutions, or networks may restrict required
							ports/protocols. Test access ahead of time using our connectivity
							checklist where available.
						</li>
						<li>
							We may restrict access in jurisdictions subject to sanctions or
							legal limitations. See our Terms and Conditions for compliance
							obligations.
						</li>
					</ul>
				</section>

				{/* 8. Fees, Taxes & Invoices (Digital Delivery) */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						8. Fees, Taxes & Invoices (Digital Delivery)
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>No shipping or handling fees apply.</li>
						<li>
							Applicable taxes (e.g., GST/VAT) may be charged depending on your
							billing address and local law.
						</li>
						<li>
							Invoices and receipts are delivered electronically to your
							registered email and are downloadable from your dashboard.
						</li>
					</ul>
				</section>

				{/* 9. Cancellations, Reschedules & Service Credits */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						9. Cancellations, Reschedules & Service Credits
					</h2>
					<p className='text-gray-700'>
						Delivery of access is tied to your scheduled slot. For
						cancellations, reschedules, and eligibility for service credits in
						case of service-impacting issues, please refer to our{' '}
						<span className='font-medium'>Cancellation & Refund Policy</span>.
					</p>
				</section>

				{/* 10. Contact */}
				<section className='space-y-4 mt-12 border-t pt-8'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						10. Contact Us
					</h2>
					<p className='text-gray-700'>
						For questions about access delivery or scheduling, contact{' '}
						<span className='font-medium'>support@acirackrentals.com</span> or
						visit <span className='font-medium'>acirackrentals.com</span>.
					</p>
					<p className='text-sm text-gray-500'>
						<span className='font-medium'>Note:</span> This Shipping, Delivery &
						Access Policy is provided for general informational purposes and
						does not constitute legal advice. Please consult legal counsel to
						tailor this policy to your business and jurisdiction.
					</p>
				</section>
			</div>
		</div>
	);
}
