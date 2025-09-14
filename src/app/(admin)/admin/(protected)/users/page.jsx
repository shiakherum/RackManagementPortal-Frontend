import UsersDataTable from '@/components/admin/users/UsersDataTable';
import { Button } from '@/components/ui/button';
import { Download, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
					<p className='text-muted-foreground'>
						Manage user accounts, roles, and permissions across your platform.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' className='gap-2'>
						<Download className='h-4 w-4' />
						Export Users
					</Button>
					<Button size='sm' className='gap-2'>
						<Link href='/admin/users/add'>
							<span className='flex gap-2 items-center'>
								<UserPlus className='h-4 w-4' />
								Add New User
							</span>
						</Link>
					</Button>
				</div>
			</div>

			{/* Stats Cards - Will be added later when backend supports user stats */}

			{/* Main Data Table */}
			<UsersDataTable />
		</div>
	);
}
