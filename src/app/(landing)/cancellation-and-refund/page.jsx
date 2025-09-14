export default function CancellationAndRefundPolicy() {
	return (
		<div className='bg-white'>
			{/* Hero */}
			<div className='bg-gray-100 py-24 sm:py-32'>
				<div className='mx-auto max-w-4xl px-6 lg:px-8'>
					<h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Cancellation & Refund Policy
					</h1>
					<p className='mt-6 text-base text-gray-600'>
						Effective date:{' '}
						<span className='font-medium text-gray-900'>August 13, 2025</span>
					</p>
					<p className='mt-2 text-sm text-gray-600 leading-relaxed'>
						This Cancellation & Refund Policy (the "Policy") explains how
						cancellations, rescheduling, no-shows, refunds, and service credits
						work for bookings and token purchases on{' '}
						<span className='font-medium'>acirackrentals.com</span> (the "Site")
						operated by <span className='font-medium'>ACI Rack Rentals</span>{' '}
						("ACI Rack Rentals", "we", "us", or "our"). By purchasing token
						packs or booking a rack, you agree to this Policy.
					</p>
				</div>
			</div>

			{/* Body */}
			<div className='mx-auto max-w-4xl px-6 lg:px-8 py-16'>
				{/* 1. Scope */}
				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold text-gray-900'>1. Scope</h2>
					<p className='text-gray-700'>
						This Policy covers: (a) cancellations and rescheduling of rack
						bookings; (b) refunds for Token Pack purchases; (c) refunds or
						service credits for service issues; and (d) special rules for
						organizational accounts, promotions, and abuse prevention.
						Capitalized terms not defined here have the meanings in our Terms
						and Conditions.
					</p>
				</section>

				{/* 2. Definitions */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						2. Key Definitions
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Booking</span>: a reservation for a
							rack time-slot created by redeeming Tokens via your dashboard.
						</li>
						<li>
							<span className='font-medium'>Tokens / Token Pack</span>: prepaid
							digital credits sold by ACI Rack Rentals to book racks. Tokens
							have no cash value and are not legal tender.
						</li>
						<li>
							<span className='font-medium'>Service Credit</span>: non-cash
							credits (usually Tokens or booking credits) issued at our
							discretion for eligible service-impacting incidents.
						</li>
					</ul>
				</section>

				{/* 3. Standard Cancellation Window */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						3. Standard Cancellation Window
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Free Cancellation.</span> Cancel a
							booking at least <span className='font-medium'>24 hours</span>{' '}
							before the scheduled start time to receive an automatic return of
							the redeemed Tokens to your balance (less any stated cancellation
							fee, if applicable at purchase time).
						</li>
						<li>
							<span className='font-medium'>Late Cancellation.</span> Cancelling
							within <span className='font-medium'>24 hours</span> of the start
							time results in forfeiture of the Tokens for that booking.
						</li>
						<li>
							<span className='font-medium'>No-Show.</span> Failure to connect
							or use the rack during your time-slot is treated as a late
							cancellation and the Tokens are forfeited.
						</li>
					</ul>
				</section>

				{/* 4. Rescheduling Policy */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						4. Rescheduling
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Rescheduling is allowed up to{' '}
							<span className='font-medium'>24 hours</span> before the start
							time, subject to slot availability. No additional Tokens are
							required beyond the original redemption.
						</li>
						<li>
							Within the 24-hour window, rescheduling may be disallowed or may
							require additional Tokens if an emergency reschedule option is
							offered in your plan.
						</li>
						<li>
							Rescheduled bookings retain the original Tokens’ characteristics
							(including expiry date).
						</li>
					</ul>
				</section>

				{/* 5. Partial Usage & Overruns */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						5. Partial Usage & Overruns
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Unused minutes within a booking are not refundable and cannot be
							credited.
						</li>
						<li>
							Access ends automatically at the scheduled end time. Extending
							usage requires a new booking with additional Tokens.
						</li>
					</ul>
				</section>

				{/* 6. Token Purchases: Refundability & Expiry */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						6. Token Purchases: Refundability & Expiry
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>
								All Token Pack sales are final.
							</span>{' '}
							Except where required by law, Token Packs are{' '}
							<span className='font-medium'>non-refundable</span> and cannot be
							exchanged for cash or monetary value.
						</li>
						<li>
							Tokens are redeemable only for rack bookings on the Site and are
							non-transferable unless explicitly enabled for organizational
							sub-accounts.
						</li>
						<li>
							Unless stated otherwise at purchase, Tokens{' '}
							<span className='font-medium'>expire 6 months</span> from the
							purchase date. Expired Tokens cannot be reinstated or refunded.
						</li>
					</ul>
				</section>

				{/* 7. Service Issues & Eligibility for Credits */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						7. Service Issues & Eligibility for Credits
					</h2>
					<p className='text-gray-700'>
						If your booking is materially impacted by a service issue within our
						reasonable control (e.g., rack unreachable due to our infrastructure
						fault), you may be eligible for a Service Credit or replacement
						booking.
					</p>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Report During the Slot.</span> You
							must report the problem to{' '}
							<span className='font-medium'>support@acirackrentals.com</span>{' '}
							while your booking is active, including time-stamped screenshots
							or logs and your booking ID. This allows us to troubleshoot live.
						</li>
						<li>
							<span className='font-medium'>Exclusions.</span> We do not issue
							credits for issues caused by (a) your local connectivity,
							firewall/VPN, or ISP problems; (b) misconfigurations inside your
							lab; (c) third-party software/licensing; (d) force majeure events;
							or (e) any breach of our Terms or Acceptable Use Policy.
						</li>
						<li>
							<span className='font-medium'>Form of Remedy.</span> Remedies are
							typically replacement Tokens or a rebooked slot of equivalent
							value, at our discretion. Cash refunds are not provided for
							service issues, except where required by law.
						</li>
					</ul>
				</section>

				{/* 8. Scheduled Maintenance & Announced Outages */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						8. Scheduled Maintenance & Announced Outages
					</h2>
					<p className='text-gray-700'>
						For maintenance windows announced in advance, affected bookings may
						be rescheduled at no additional Token cost or credited with
						replacement Tokens at our discretion. Please watch for dashboard
						banners or email notices.
					</p>
				</section>

				{/* 9. Payment Method, Refund Channel & Timelines */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						9. Payment Method, Refund Channel & Timelines
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Where a cash refund is required by law, refunds (if approved) are
							issued to the original payment method only.
						</li>
						<li>
							Processing times vary by provider; most refunds appear within 5–10
							business days after approval. Service Credits are typically
							applied to your account within 2 business days.
						</li>
						<li>
							We are not responsible for delays caused by your bank, card
							network, or payment processor.
						</li>
					</ul>
				</section>

				{/* 10. Chargebacks & Disputes */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						10. Chargebacks & Disputes
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Before initiating a chargeback, please contact{' '}
							<span className='font-medium'>support@acirackrentals.com</span> so
							we can investigate and resolve promptly.
						</li>
						<li>
							Unfounded or abusive chargebacks may result in suspension of your
							account and forfeiture of Tokens or bookings as permitted by law.
						</li>
					</ul>
				</section>

				{/* 11. Promotions, Coupons & Bundles */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						11. Promotions, Coupons & Bundles
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Promotional Token Packs, coupons, and bundles may carry special
							terms (e.g., shorter expiry, restricted time-slots). Such terms
							will be displayed at purchase and prevail over conflicting terms
							here.
						</li>
						<li>
							Promotional items are non-refundable unless required by law or
							expressly stated otherwise.
						</li>
					</ul>
				</section>

				{/* 12. Organizational & Team Accounts */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						12. Organizational & Team Accounts
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Where enabled, administrators may allocate Tokens to sub-accounts.
							Internal transfers are at the admin’s discretion and are not
							refundable by us.
						</li>
						<li>
							Refunds (where legally required) are issued only to the original
							purchasing entity and payment method.
						</li>
					</ul>
				</section>

				{/* 13. Abuse, Fraud & Policy Violations */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						13. Abuse, Fraud & Policy Violations
					</h2>
					<p className='text-gray-700'>
						We may deny refunds, withhold Service Credits, or suspend accounts
						where we reasonably suspect abuse or violation of our Terms (e.g.,
						deliberate disruptions, sharing credentials, prohibited activities).
						Tokens may be forfeited in such cases as allowed by law.
					</p>
				</section>

				{/* 14. How to Request a Cancellation, Refund, or Credit */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						14. How to Request a Cancellation, Refund, or Credit
					</h2>
					<ol className='list-decimal pl-6 text-gray-700 space-y-2'>
						<li>
							Go to your dashboard → Bookings → select the booking → choose{' '}
							<span className='font-medium'>Cancel</span> or{' '}
							<span className='font-medium'>Reschedule</span> as available.
						</li>
						<li>
							For service issues, email{' '}
							<span className='font-medium'>support@acirackrentals.com</span>{' '}
							during the affected slot with: booking ID, timeframe,
							screenshots/logs, and a brief description.
						</li>
						<li>
							For legally required refunds on Token purchases, email us from
							your registered email with the order ID and reason. We may request
							additional verification for security.
						</li>
					</ol>
				</section>

				{/* 15. Local Consumer Rights */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						15. Local Consumer Rights
					</h2>
					<p className='text-gray-700'>
						Nothing in this Policy limits any non-waivable consumer rights you
						may have under applicable laws. Where this Policy conflicts with
						such rights, those rights will prevail to the extent required by
						law.
					</p>
				</section>

				{/* 16. Changes to this Policy */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						16. Changes to this Policy
					</h2>
					<p className='text-gray-700'>
						We may update this Policy from time to time. Material changes will
						be communicated via the Site and/or email (if on file). Continued
						use after the effective date constitutes acceptance of the updated
						Policy.
					</p>
				</section>

				{/* 17. Contact */}
				<section className='space-y-4 mt-12 border-t pt-8'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						17. Contact Us
					</h2>
					<p className='text-gray-700'>
						Questions about cancellations, refunds, or credits? Contact{' '}
						<span className='font-medium'>support@acirackrentals.com</span> or
						visit <span className='font-medium'>acirackrentals.com</span>.
					</p>
					<p className='text-sm text-gray-500'>
						<span className='font-medium'>Note:</span> This Policy is provided
						for general informational purposes and does not constitute legal
						advice. Consider consulting counsel to tailor this Policy to your
						specific business and jurisdiction.
					</p>
				</section>
			</div>
		</div>
	);
}
