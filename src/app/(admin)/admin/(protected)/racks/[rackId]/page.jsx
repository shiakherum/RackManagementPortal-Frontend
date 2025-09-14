import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditRackForm from '@/components/admin/racks/EditRackForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

// Server-side function to fetch a single rack's data
async function getRack(rackId) {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) return null;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/racks/${rackId}`,
			{
				headers: { Authorization: `Bearer ${session.accessToken}` },
				cache: 'no-store', // Ensures we always get the latest data
			}
		);
		if (!response.ok) return null;
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Failed to fetch rack:', error);
		return null;
	}
}

export default async function EditRackPage({ params }) {
	const rack = await getRack(params.rackId);

	if (!rack) {
		return (
			<div className='flex flex-1 flex-col gap-6'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error Loading Rack</AlertTitle>
					<AlertDescription>
						Could not load rack data. The rack may not exist or there was a
						server error.
						<Button variant='link' asChild className='p-0 h-auto ml-2'>
							<Link href='/admin/racks'>Return to Racks List</Link>
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/racks'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Racks</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Edit Rack</h1>
					<p className='text-muted-foreground'>
						Modify the details for{' '}
						<span className='font-medium'>{rack.name}</span>.
					</p>
				</div>
			</div>

			{/* Single Column Layout - Fixed Width */}
			<div className='max-w-7xl'>
				<Card>
					<CardHeader>
						<CardTitle>Rack Configuration</CardTitle>
						<CardDescription>
							Update the rack details below. All required fields are marked with
							*.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<EditRackForm rack={rack} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
