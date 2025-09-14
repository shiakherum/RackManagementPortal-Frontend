import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditTokenPackForm from '@/components/admin/token-packs/EditTokenPackForm';
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

// Server-side function to fetch a single token pack's data
async function getTokenPack(packId) {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) return null;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/token-packs/${packId}`,
			{
				headers: { Authorization: `Bearer ${session.accessToken}` },
				cache: 'no-store',
			}
		);
		if (!response.ok) return null;
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Failed to fetch token pack:', error);
		return null;
	}
}

export default async function EditTokenPackPage({ params }) {
	const pack = await getTokenPack(params.packId);

	if (!pack) {
		return (
			<div className='flex flex-1 flex-col gap-6'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error Loading Token Pack</AlertTitle>
					<AlertDescription>
						Could not load data. The pack may not exist or there was a server
						error.
						<Button variant='link' asChild className='p-0 h-auto ml-2'>
							<Link href='/admin/token-packs'>Return to Token Packs List</Link>
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-6'>
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/token-packs'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Token Packs</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Edit Token Pack</h1>
					<p className='text-muted-foreground'>
						Modify the details for{' '}
						<span className='font-medium'>{pack.name}</span>.
					</p>
				</div>
			</div>
			<div className='max-w-4xl'>
				<EditTokenPackForm pack={pack} />
			</div>
		</div>
	);
}
