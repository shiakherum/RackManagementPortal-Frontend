'use client';
import {
	CheckCircleIcon,
	EllipsisHorizontalIcon,
	ServerStackIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RackPromoBanner from './RackPromoBanner';


export default function Racks() {
	const [racks, setRacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRacks = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/racks`);
				setRacks(response.data.data || []);
			} catch (err) {
				console.error('Error fetching racks:', err);
				setError('Failed to load racks');
			} finally {
				setLoading(false);
			}
		};

		fetchRacks();
	}, []);

	// Helper function to format rack data for display (same as in RackCards)
	const formatRackForDisplay = (rack) => {
		// Get features from featuresList or specifications
		let allFeatures = [];
		if (rack.featuresList && rack.featuresList.length > 0) {
			allFeatures = rack.featuresList;
		} else if (rack.specifications && rack.specifications.length > 0) {
			allFeatures = rack.specifications.map(spec => `${spec.specName}: ${spec.specValue}`);
		}

		// Default features if none available
		if (allFeatures.length === 0) {
			allFeatures = [
				'Available for booking',
				'Professional support included',
				'Flexible scheduling',
				'Enterprise-grade hardware'
			];
		}

		// Ensure minimum 4 features, pad with defaults if needed
		const defaultFeatures = [
			'24/7 availability',
			'Secure access',
			'Regular maintenance',
			'Expert technical support'
		];

		while (allFeatures.length < 4) {
			const nextDefault = defaultFeatures[allFeatures.length % defaultFeatures.length];
			if (!allFeatures.includes(nextDefault)) {
				allFeatures.push(nextDefault);
			} else {
				allFeatures.push(`Additional feature ${allFeatures.length + 1}`);
			}
		}

		// Show first 4 features, add indicator if more exist
		const displayFeatures = allFeatures.slice(0, 4);
		const hasMoreFeatures = allFeatures.length > 4;

		return {
			id: rack._id,
			deviceId: rack.deviceId,
			title: rack.name,
			tagline: rack.titleFeature || rack.description?.substring(0, 50) + '...',
			tokens: rack.tokenCostPerHour || 0,
			stats: {
				nodes: rack.specifications?.length > 0 ? `${rack.specifications.length} Specs` : 'Available',
				tokenTxt: rack.tokenCostPerHour ? `${rack.tokenCostPerHour} Tokens / h` : 'Available'
			},
			specs: displayFeatures,
			hasMoreFeatures,
			totalFeatures: allFeatures.length,
			cta: {
				primary: 'Book Now',
				href: `/racks/${rack.deviceId}`
			},
			ctaFinalLine: rack.ctaFinalLine || 'Ready to get started?'
		};
	};

	return (
		<>
			<RackPromoBanner />
			<div className='bg-gray-100 py-24 sm:py-32'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:mx-0'>
						<p className='uppercase tracking-wider text-gray-400 font-semibold mb-2'>
							On-demand Rack Rentals
						</p>

						<h2 className='mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl'>
							ACI Rack Catalog
						</h2>

						<p className='mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
							Browse our catalog of high-performance rack setups tailored for
							ACI labs, DCACI exam prep, and production-grade POCs. Whether
							you're a student, professional, or trainer — we've got a rack that
							fits your exact needs. Instantly accessible over SSH, VNC, or Web
							Console.
						</p>
					</div>
				</div>
			</div>

			<section className='px-6 lg:py-32 lg:pt-0 bg-gray-100'>
				<div className='mx-auto max-w-2xl md:max-w-7xl sm:px-8'>
					{loading ? (
						<div className='text-center py-24'>
							<h3 className='text-2xl font-semibold text-gray-900'>Loading racks...</h3>
						</div>
					) : error ? (
						<div className='text-center py-24'>
							<h3 className='text-2xl font-semibold text-red-600'>{error}</h3>
						</div>
					) : (
						<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-20'>
							{racks.length === 0 ? (
								<div className='col-span-full text-center py-12'>
									<p className='text-lg text-gray-500'>No racks available at the moment.</p>
								</div>
							) : (
								racks.map((rack) => {
									const displayRack = formatRackForDisplay(rack);
									return (
										<article
											key={displayRack.id}
											className='group flex flex-col rounded-2xl bg-white shadow ring-1 ring-gray-200 transition
		                         hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-300/60'>
											{/* header row */}
											<div className='flex items-start justify-between p-7'>
												<div className='flex items-center gap-3'>
													{/* gradient splash circle with ServerStack icon for all */}
													<span
														className='flex h-10 w-10 items-center justify-center rounded-full
		                                   bg-gradient-to-r from-indigo-500 to-violet-600
		                                   text-white transition group-hover:from-indigo-500 group-hover:to-violet-500'>
														<ServerStackIcon className='h-5 w-5' aria-hidden />
													</span>
													<div>
														<h3 className='text-base font-semibold text-gray-900'>
															{displayRack.title}
														</h3>
														<p className='text-sm text-gray-500'>{displayRack.tagline}</p>
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
														{displayRack.stats.nodes}
													</p>
												</div>
												<div className='text-right'>
													<p className='text-xs font-medium text-gray-500'>Price</p>
													<p className='text-lg tracking-tight font-semibold text-emerald-600'>
														{displayRack.stats.tokenTxt}
													</p>
												</div>
											</div>

											{/* divider */}
											<div className='h-px bg-gray-100' />

											{/* spec list */}
											<ul className='flex-1 space-y-1 px-7 py-5 text-sm text-gray-700'>
												{displayRack.specs.map((spec, i) => (
													<li key={i} className='flex gap-2'>
														<CheckCircleIcon
															className='h-4 w-4 text-indigo-500'
															aria-hidden
														/>
														<span>{spec}</span>
													</li>
												))}
												{displayRack.hasMoreFeatures && (
													<li className='flex gap-2 text-indigo-600 font-medium'>
														<CheckCircleIcon
															className='h-4 w-4 text-indigo-500'
															aria-hidden
														/>
														<span>+ {displayRack.totalFeatures - 4} more features...</span>
													</li>
												)}
											</ul>

											{/* divider */}
											<div className='h-px bg-gray-100' />

											{/* CTA buttons */}
											<div className='flex gap-3 px-7 py-6 bg-gray-50 rounded-bl-2xl rounded-br-2xl'>
												<a
													href={`/racks/${displayRack.deviceId}`}
													className='flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'>
													More Details
												</a>
												<a
													href={displayRack.cta.href}
													className='flex-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500'>
													{displayRack.cta.primary}
												</a>
											</div>
										</article>
									);
								})
							)}
						</div>
					)}
				</div>
			</section>

			<div className='bg-white border-t-1 border-gray-200'>
				<div className='mx-auto max-w-7xl px-6 py-24 lg:flex lg:items-center lg:justify-between lg:px-8'>
					{/* headline */}
					<h2 className='max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
						Still have questions?
						<br />
						Chat with our support team.
					</h2>

					{/* button */}
					<div className='mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0'>
						<a
							href='/contact'
							className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
							Talk to us&nbsp;&rarr;
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
