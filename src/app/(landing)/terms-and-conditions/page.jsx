export default function TermsAndConditions() {
	return (
		<div className='bg-white'>
			{/* Hero */}
			<div className='bg-gray-100 py-24 sm:py-32'>
				<div className='mx-auto max-w-4xl px-6 lg:px-8'>
					<h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Terms and Conditions
					</h1>
					<p className='mt-6 text-base text-gray-600'>
						Effective date:{' '}
						<span className='font-medium text-gray-900'>August 13, 2025</span>
					</p>
					<p className='mt-2 text-sm leading-relaxed text-gray-600'>
						These Terms and Conditions (the "Terms") govern your access to and
						use of the ACI Rack Rentals platform and services at{' '}
						<span className='font-medium'>acirackrentals.com</span> (the
						"Site"), including any content, functionality, rack rental services,
						token packs, and related offerings provided by{' '}
						<span className='font-medium'>ACI Rack Rentals</span> ("ACI Rack
						Rentals", "we", "us", or "our"). By creating an account, purchasing
						tokens, booking racks, or otherwise using the Site, you agree to be
						bound by these Terms.
					</p>
				</div>
			</div>

			{/* Body */}
			<div className='mx-auto max-w-4xl px-6 lg:px-8 py-16'>
				{/* 1. Definitions */}
				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						1. Definitions
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>"Account"</span> means a unique
							profile you create on the Site to purchase token packs, book
							racks, and manage your usage.
						</li>
						<li>
							<span className='font-medium'>"Rack"</span> means a remotely
							accessible lab rack or portion thereof comprising Cisco ACI
							controllers, leaf/spine switches, virtual machines, and/or other
							network, compute, or storage resources made available by ACI Rack
							Rentals for time-bound use.
						</li>
						<li>
							<span className='font-medium'>"Tokens"</span> or{' '}
							<span className='font-medium'>"Token Packs"</span> are prepaid
							digital credits sold by ACI Rack Rentals that can be redeemed to
							book racks for specified durations.
						</li>
						<li>
							<span className='font-medium'>"Booking"</span> means a reservation
							for a rack time-slot created by redeeming tokens via the Site.
						</li>
						<li>
							<span className='font-medium'>"Services"</span> means the Site,
							APIs, dashboards, racks, scheduling system, documentation, and
							support we provide.
						</li>
					</ul>
				</section>

				{/* 2. Eligibility & Accounts */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						2. Eligibility; Account Registration
					</h2>
					<p className='text-gray-700'>
						You must be at least 18 years old and capable of forming a binding
						contract to use the Services. You agree to provide accurate,
						complete information when creating your Account and to keep it
						current. You are responsible for (a) safeguarding your credentials;
						(b) all activities under your Account; and (c) promptly notifying us
						of any unauthorized use or security incident.
					</p>
				</section>

				{/* 3. Token Packs */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						3. Token Packs: Purchase, Value, Expiry
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Purchase.</span> Token Packs may be
							purchased through the Site using available payment methods. We may
							change available packs, pricing, or inclusions at any time.
						</li>
						<li>
							<span className='font-medium'>Redemption.</span> Tokens are
							redeemable only on the Site for rack bookings and have no cash
							value. Tokens are not legal tender, are non-redeemable for money,
							and are non-transferable unless your plan explicitly allows
							transfers within your organization’s sub-accounts.
						</li>
						<li>
							<span className='font-medium'>Expiry.</span> Unless otherwise
							stated at purchase, Tokens expire{' '}
							<span className='font-medium'>6 months</span> from the purchase
							date. Expired Tokens cannot be reinstated.
						</li>
						<li>
							<span className='font-medium'>Adjustments.</span> We may deduct
							Tokens for no-shows, late cancellations, or policy violations as
							outlined below.
						</li>
					</ul>
				</section>

				{/* 4. Booking & Scheduling */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						4. Bookings, Scheduling, Rescheduling, and Cancellations
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Time-Slots.</span> Bookings are
							created by selecting an available time-slot and redeeming the
							required Tokens. Your access begins and ends precisely at the slot
							times shown in your dashboard.
						</li>
						<li>
							<span className='font-medium'>Rescheduling.</span> You may
							reschedule a booking up to{' '}
							<span className='font-medium'>24 hours</span> before the start
							time, subject to availability. After this window, rescheduling may
							be disallowed or incur additional Token deductions.
						</li>
						<li>
							<span className='font-medium'>Cancellations.</span> Cancellations
							made at least <span className='font-medium'>24 hours</span> before
							the start time return the Tokens to your balance (subject to any
							stated rescheduling/cancellation fees). Later cancellations or
							no-shows will forfeit the Tokens for that booking.
						</li>
						<li>
							<span className='font-medium'>Overruns.</span> Access ends
							automatically at the scheduled end time. If you require more time,
							you must create a new booking, subject to availability.
						</li>
						<li>
							<span className='font-medium'>Maintenance/Outages.</span> See
							Section 11 for our maintenance and availability commitments.
						</li>
					</ul>
				</section>

				{/* 5. Acceptable Use & Technical Restrictions */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						5. Acceptable Use; Technical Restrictions
					</h2>
					<p className='text-gray-700'>
						You agree to use the Services solely for lawful lab practice,
						training, and solution testing and in compliance with all applicable
						laws and regulations. You must not misappropriate, harm, or
						interfere with our infrastructure, or the safety and privacy of
						others. Without limitation, you agree not to:
					</p>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Attempt to gain unauthorized access to racks, systems, accounts,
							or data beyond your allocated resources.
						</li>
						<li>
							Run denial-of-service attacks, port scans outside your lab
							segment, malware, crypto-mining, spamming, or any activity that
							disrupts or degrades the Services or others’ usage.
						</li>
						<li>
							Exfiltrate or process third-party personal data or confidential
							information unless you have a lawful basis and necessary consents.
						</li>
						<li>
							Transmit illegal content, infringe intellectual property, or
							violate export control or sanctions laws.
						</li>
						<li>
							Share credentials, sublicense access, or circumvent booking
							limits, metering, or security controls.
						</li>
						<li>
							Modify, reverse engineer, or copy any part of the Services except
							as expressly permitted by law.
						</li>
					</ul>
					<p className='text-gray-700'>
						We reserve the right to monitor usage (in compliance with our
						Privacy Policy) to ensure compliance, maintain service quality, and
						protect our users and infrastructure.
					</p>
				</section>

				{/* 6. Data Handling & Persistence */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						6. Data Handling, Backups, and Persistence
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Ephemeral Nature.</span> Rack
							environments may be reset between bookings. You are solely
							responsible for exporting and backing up any configurations, logs,
							or artifacts you wish to retain before your booking ends.
						</li>
						<li>
							<span className='font-medium'>No PII/Regulated Data.</span> Do not
							upload or process personal data, payment card data, health data,
							or other regulated information inside racks. Use synthetic or test
							data.
						</li>
						<li>
							<span className='font-medium'>Logs & Telemetry.</span> We may
							collect operational metrics and security logs to operate, secure,
							and improve the Services, consistent with our Privacy Policy.
						</li>
					</ul>
				</section>

				{/* 7. Fees, Billing & Taxes */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						7. Pricing, Fees, Billing & Taxes
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Prices for Token Packs and Services are listed on the Site and may
							change at any time. Changes do not affect prior purchases.
						</li>
						<li>
							You authorize us (and our payment processors) to charge your
							selected payment method for all purchases, fees, and applicable
							taxes.
						</li>
						<li>
							All amounts are exclusive of taxes unless stated otherwise. You
							are responsible for any GST/VAT, duties, or similar taxes arising
							from your purchases.
						</li>
						<li>
							Invoices and receipts will be provided electronically. You agree
							to receive them in electronic form.
						</li>
						<li>
							We may offer optional auto-reload of Token Packs if you enable it
							in your Account settings.
						</li>
					</ul>
				</section>

				{/* 8. Refunds & Credits */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						8. Refunds and Service Credits
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Change of Mind.</span> Except where
							required by law, purchases of Token Packs are{' '}
							<span className='font-medium'>non-refundable</span>.
						</li>
						<li>
							<span className='font-medium'>Service Issues.</span> If a booking
							is materially impacted by a service outage within our control and
							you promptly notify us during the slot, we may, at our discretion,
							issue replacement Tokens or a service credit.
						</li>
						<li>
							<span className='font-medium'>Abuse.</span> We do not issue
							refunds or credits for issues caused by violations of these Terms
							or by external factors outside our control (e.g., your
							connectivity, misconfigurations, or third-party failures).
						</li>
					</ul>
				</section>

				{/* 9. Availability, Maintenance & SLA */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						9. Availability, Maintenance, and Service Levels
					</h2>
					<p className='text-gray-700'>
						We strive to provide reliable access to racks; however, the Services
						are provided on a commercially reasonable efforts basis and{' '}
						<span className='font-medium'>no specific uptime guarantee</span> is
						provided unless expressly stated in a separate, signed Service Level
						Agreement. We may perform scheduled maintenance (typically during
						low-traffic windows) and will endeavor to communicate material
						maintenance in advance.
					</p>
				</section>

				{/* 10. Security & Access Controls */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						10. Security, Access Controls, and Credentials
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							Use only the access methods and credentials provided by us. Do not
							share or reuse credentials between users.
						</li>
						<li>
							You are responsible for configuring your lab environment within
							your allocated segment safely and for promptly revoking exposed
							keys or secrets you upload.
						</li>
						<li>
							Notify us immediately if you suspect any unauthorized access or
							compromise of your Account or booking.
						</li>
					</ul>
				</section>

				{/* 11. Third-Party Tools & Content */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						11. Third-Party Software, Licenses, and Content
					</h2>
					<p className='text-gray-700'>
						Your use of any third-party tools, images, software, or content
						inside racks is subject to those third parties’ license terms. You
						are solely responsible for obtaining and maintaining valid licenses
						and complying with their terms.
					</p>
				</section>

				{/* 12. Intellectual Property */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						12. Intellectual Property; License
					</h2>
					<p className='text-gray-700'>
						The Services, including all associated software, content,
						trademarks, and branding, are owned by ACI Rack Rentals and its
						licensors and are protected by intellectual property laws. Subject
						to these Terms, we grant you a limited, non-exclusive,
						non-transferable, revocable license to access and use the Services
						for your internal training, lab practice, and solution testing. We
						reserve all rights not expressly granted.
					</p>
				</section>

				{/* 13. Feedback */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>13. Feedback</h2>
					<p className='text-gray-700'>
						If you send us feedback or suggestions, you grant us a perpetual,
						irrevocable, worldwide, royalty-free license to use and exploit such
						feedback for any purpose, without obligation to you.
					</p>
				</section>

				{/* 14. Beta/Preview Features */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						14. Beta or Preview Features
					</h2>
					<p className='text-gray-700'>
						From time to time we may offer beta or preview features identified
						as such. These are provided "as is", may be discontinued at any
						time, and may be subject to additional terms.
					</p>
				</section>

				{/* 15. Compliance & Export */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						15. Compliance, Sanctions, and Export Controls
					</h2>
					<p className='text-gray-700'>
						You represent that you are not located in, under the control of, or
						a national or resident of any country or region subject to
						comprehensive sanctions, and that you are not an individual or
						entity on any restricted list maintained by applicable authorities.
						You agree to comply with all applicable export control and sanctions
						laws in connection with your use of the Services.
					</p>
				</section>

				{/* 16. Disclaimers */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						16. Disclaimers
					</h2>
					<p className='text-gray-700'>
						EXCEPT AS EXPRESSLY PROVIDED IN WRITING, THE SERVICES ARE PROVIDED
						ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY
						KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT
						LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
						PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
						SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT DEFECTS
						WILL BE CORRECTED.
					</p>
				</section>

				{/* 17. Limitation of Liability */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						17. Limitation of Liability
					</h2>
					<p className='text-gray-700'>
						TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACI RACK RENTALS AND ITS
						AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR
						ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
						PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA,
						GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION
						WITH THE SERVICES OR THESE TERMS, EVEN IF ADVISED OF THE POSSIBILITY
						OF SUCH DAMAGES. OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO
						THE SERVICES OR THESE TERMS SHALL NOT EXCEED THE AMOUNTS PAID BY YOU
						TO US FOR THE SERVICES GIVING RISE TO THE CLAIM DURING THE TWELVE
						(12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
					</p>
				</section>

				{/* 18. Indemnification */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						18. Indemnification
					</h2>
					<p className='text-gray-700'>
						You agree to defend, indemnify, and hold harmless ACI Rack Rentals,
						its affiliates, and their respective officers, directors, employees,
						and agents from and against any claims, liabilities, damages,
						losses, and expenses (including reasonable attorneys’ fees) arising
						out of or related to: (a) your use of the Services; (b) your
						content, data, or configurations; (c) your violation of these Terms;
						or (d) your violation of any law or rights of a third party.
					</p>
				</section>

				{/* 19. Suspension & Termination */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						19. Suspension and Termination
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							We may suspend or terminate your access immediately for violations
							of these Terms, for security reasons, or to comply with law.
						</li>
						<li>
							You may close your Account at any time. Tokens remaining at
							closure are forfeited unless required otherwise by law.
						</li>
						<li>
							Upon termination, your right to access the Services ceases, but
							provisions that by their nature should survive (e.g., intellectual
							property, disclaimers, limitations of liability, indemnities) will
							remain in effect.
						</li>
					</ul>
				</section>

				{/* 20. Governing Law & Dispute Resolution */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						20. Governing Law and Dispute Resolution
					</h2>
					<p className='text-gray-700'>
						These Terms are governed by the laws of India, without regard to its
						conflict of laws rules. Subject to applicable law, the courts
						located in Mumbai, Maharashtra shall have exclusive jurisdiction
						over any disputes arising from or relating to these Terms or the
						Services. You and ACI Rack Rentals consent to personal jurisdiction
						and venue in those courts.
					</p>
				</section>

				{/* 21. Changes to the Services or Terms */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						21. Changes to the Services or these Terms
					</h2>
					<p className='text-gray-700'>
						We may modify the Services or these Terms from time to time. If we
						make material changes, we will provide notice by posting on the Site
						and/or emailing you (if you have provided your email). Changes
						become effective upon posting unless otherwise specified. Your
						continued use after changes become effective constitutes acceptance
						of the new Terms.
					</p>
				</section>

				{/* 22. Communications & Notices */}
				<section className='space-y-4 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						22. Communications and Notices
					</h2>
					<p className='text-gray-700'>
						You agree that we may send you communications regarding your
						Account, purchases, bookings, and legal notices electronically.
						Official notices to ACI Rack Rentals must be sent to{' '}
						<span className='font-medium'>support@acirackrentals.com</span> (or
						as updated on the Site). Update your Account email to ensure you
						receive notices.
					</p>
				</section>

				{/* 23. Miscellaneous */}
				<section className='space-y-3 mt-12'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						23. Miscellaneous
					</h2>
					<ul className='list-disc pl-6 text-gray-700 space-y-2'>
						<li>
							<span className='font-medium'>Severability.</span> If any
							provision is held invalid, the remaining provisions will remain in
							full force and effect.
						</li>
						<li>
							<span className='font-medium'>No Waiver.</span> Our failure to
							enforce any right or provision shall not be a waiver of such right
							or provision.
						</li>
						<li>
							<span className='font-medium'>Assignment.</span> You may not
							assign these Terms without our prior written consent. We may
							assign these Terms in connection with a merger, acquisition, or
							sale of assets.
						</li>
						<li>
							<span className='font-medium'>Force Majeure.</span> We are not
							liable for delays or failures caused by events beyond our
							reasonable control, including acts of God, network failures, or
							government actions.
						</li>
						<li>
							<span className='font-medium'>Entire Agreement.</span> These
							Terms, along with any policies referenced herein (including the
							Privacy Policy and any applicable SLA), constitute the entire
							agreement between you and ACI Rack Rentals regarding the Services.
						</li>
					</ul>
				</section>

				{/* 24. Contact */}
				<section className='space-y-4 mt-12 border-t pt-8'>
					<h2 className='text-2xl font-semibold text-gray-900'>
						24. Contact Us
					</h2>
					<p className='text-gray-700'>
						For questions about these Terms or the Services, contact us at{' '}
						<span className='font-medium'>support@acirackrentals.com</span> or
						visit <span className='font-medium'>acirackrentals.com</span>.
					</p>
					<p className='text-sm text-gray-500'>
						<span className='font-medium'>Note:</span> This Terms and Conditions
						page is provided for general informational purposes only and does
						not constitute legal advice. Consider consulting qualified counsel
						to tailor these Terms to your specific business and jurisdictional
						needs.
					</p>
				</section>
			</div>
		</div>
	);
}
