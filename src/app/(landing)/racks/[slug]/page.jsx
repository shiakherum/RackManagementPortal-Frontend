'use client';
import CallToAction from '@/components/landing/single-rack/CallToAction';
import MoreDetails from '@/components/landing/single-rack/MoreDetails';
import PlatformFeatures from '@/components/landing/single-rack/PlatformFaqs';
import RackHero from '@/components/landing/single-rack/RackHero';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DynamicRackPage() {
	const params = useParams();
	const { slug } = params; // This is the deviceId
	const [rack, setRack] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRack = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/racks/${slug}`);
				setRack(response.data.data);
			} catch (err) {
				console.error('Error fetching rack:', err);
				if (err.response?.status === 404) {
					setError('Rack not found');
				} else {
					setError('Failed to load rack details');
				}
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchRack();
		}
	}, [slug]);

	if (loading) {
		return (
			<div className="bg-gray-100 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-900">Loading rack details...</h2>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-100 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-red-600">{error}</h2>
					<a
						href="/racks"
						className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						Back to Racks
					</a>
				</div>
			</div>
		);
	}

	if (!rack) {
		return (
			<div className="bg-gray-100 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-900">No rack data available</h2>
				</div>
			</div>
		);
	}

	return (
		<>
			<RackHero rack={rack} />
			<MoreDetails rack={rack} />
			<PlatformFeatures rack={rack} />
			<CallToAction rack={rack} />
		</>
	);
}