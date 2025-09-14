'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import AddUserForm from '@/components/admin/users/AddUserForm';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function AddUserPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/users'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Users</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Create New User
					</h1>
					<p className='text-muted-foreground'>
						Add a new user to the system.
					</p>
				</div>
			</div>

			{/* Single Column Layout - Fixed Width */}
			<div className='max-w-4xl'>
				<Card>
					<CardHeader>
						<CardTitle>User Details</CardTitle>
						<CardDescription>
							Fill in the form below to create a new user account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AddUserForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
