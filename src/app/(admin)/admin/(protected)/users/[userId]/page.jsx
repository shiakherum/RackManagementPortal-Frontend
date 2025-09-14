import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditUserForm from '@/components/admin/users/EditUserForm';
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

// Server-side function to fetch a single user's data
async function getUser(userId) {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) return null;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
			{
				headers: { Authorization: `Bearer ${session.accessToken}` },
				cache: 'no-store', // Ensure fresh data is fetched every time
			}
		);
		if (!response.ok) return null;
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Failed to fetch user:', error);
		return null;
	}
}

export default async function EditUserPage({ params }) {
	const user = await getUser(params.userId);

	if (!user) {
		return (
			<div className='flex flex-1 flex-col gap-6'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						Could not load user data. The user may not exist or there was a
						server error.
						<Button variant='link' asChild>
							<Link href='/admin/users'>Go back to users list.</Link>
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-6'>
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-8 w-8' asChild>
					<Link href='/admin/users'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Users</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Edit User</h1>
					<p className='text-muted-foreground'>
						Modify the details for{' '}
						<span className='font-medium'>{user.name}</span>.
					</p>
				</div>
			</div>
			<div className='max-w-5xl'>
				<Card>
					<CardHeader>
						<CardTitle>User Details</CardTitle>
						<CardDescription>
							Update the user's information below. Password changes should be
							handled via a password reset request.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Pass the fetched user data to the client component form */}
						<EditUserForm user={user} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
