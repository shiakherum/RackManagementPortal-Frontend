'use client';

import BookingsDataTable from '@/components/admin/bookings/BookingsDataTable';

export default function BookingsPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Bookings</h1>
					<p className='text-muted-foreground'>
						Manage rack bookings and user sessions
					</p>
				</div>
				{/* Add action buttons here if needed, following the same pattern as AdminUsersPage */}
			</div>

			{/* Main Data Table */}
			<BookingsDataTable />
		</div>
	);
}
