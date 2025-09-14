'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	ArrowUpDown,
	Calendar,
	Clock,
	Edit,
	MoreHorizontal,
	Plus,
	Search,
	Server,
	Trash2,
	User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import * as React from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import api from '@/lib/api';

// Define status variants for consistent styling
const getStatusVariant = (status) => {
	switch (status) {
		case 'confirmed':
			return 'default';
		case 'completed':
			return 'secondary';
		case 'cancelled':
			return 'destructive';
		case 'provisioning':
			return 'outline';
		default:
			return 'outline';
	}
};

// Format date helper
const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

// Format date and time helper
const formatDateTime = (dateString) => {
	return new Date(dateString).toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

// Calculate duration helper
const calculateDuration = (startTime, endTime) => {
	const start = new Date(startTime);
	const end = new Date(endTime);
	const diffMs = end - start;
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	
	if (hours === 0) {
		return `${minutes}m`;
	}
	return `${hours}h ${minutes}m`;
};

// Loading skeleton component
function BookingsTableSkeleton() {
	return (
		<div className='space-y-4'>
			{/* Header skeleton */}
			<div className='flex items-center justify-between'>
				<Skeleton className='h-10 w-64' />
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-32' />
					<Skeleton className='h-10 w-24' />
				</div>
			</div>

			{/* Table skeleton */}
			<div className='rounded-lg border'>
				<div className='p-4'>
					{[...Array(8)].map((_, i) => (
						<div key={i} className='flex items-center space-x-4 py-4'>
							<Skeleton className='h-4 w-4' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-3 w-48' />
							</div>
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-6 w-20' />
							<Skeleton className='h-4 w-12' />
							<Skeleton className='h-6 w-24' />
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-8 w-8' />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function BookingsDataTable() {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	// Local state for filtering and pagination
	const [searchTerm, setSearchTerm] = React.useState('');
	const [statusFilter, setStatusFilter] = React.useState('all');
	const [rowSelection, setRowSelection] = React.useState({});
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// Fetch bookings data
	const {
		data: bookings = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['adminBookings'],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get('/admin/bookings', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data || [];
		},
		enabled: !!session?.accessToken,
	});

	// Filter bookings based on search and status
	const filteredBookings = React.useMemo(() => {
		return bookings.filter((booking) => {
			const searchLower = debouncedSearchTerm.toLowerCase();
			const matchesSearch =
				!debouncedSearchTerm ||
				booking.user?.firstName?.toLowerCase().includes(searchLower) ||
				booking.user?.lastName?.toLowerCase().includes(searchLower) ||
				booking.user?.email?.toLowerCase().includes(searchLower) ||
				booking.rack?.name?.toLowerCase().includes(searchLower) ||
				booking._id?.toLowerCase().includes(searchLower);

			const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [bookings, debouncedSearchTerm, statusFilter]);

	// Delete bookings mutation
	const deleteBookingsMutation = useMutation({
		mutationFn: async (bookingIds) => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			// Delete bookings one by one (since backend doesn't support bulk delete yet)
			const promises = bookingIds.map(id => 
				api.delete(`/admin/bookings/${id}`, {
					headers: { Authorization: `Bearer ${session.accessToken}` },
				})
			);
			return Promise.all(promises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['adminBookings']);
			setRowSelection({});
			console.log('Bookings deleted successfully!');
		},
		onError: (error) => {
			console.error(
				'Error deleting bookings:',
				error.response?.data?.message || error.message
			);
		},
	});

	// Table columns definition
	const columns = React.useMemo(
		() => [
			{
				id: 'select',
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && 'indeterminate')
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label='Select all bookings'
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label='Select booking'
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: 'user',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						User
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const booking = row.original;
					return (
						<div className='flex items-center gap-3'>
							<div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
								<User className='h-4 w-4' />
							</div>
							<div className='grid gap-0.5'>
								<div className='font-medium text-sm'>
									{booking.user?.firstName && booking.user?.lastName 
										? `${booking.user.firstName} ${booking.user.lastName}` 
										: 'Unknown User'}
								</div>
								<div className='text-xs text-muted-foreground'>
									{booking.user?.email || 'No email'}
								</div>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'rack',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Rack
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const booking = row.original;
					return (
						<div className='flex items-center gap-2 text-sm'>
							<Server className='h-4 w-4 text-muted-foreground' />
							<span className='font-mono'>{booking.rack?.name || 'Unknown Rack'}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'startTime',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Start Time
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const startTime = row.getValue('startTime');
					return (
						<div className='flex items-center gap-2 text-sm'>
							<Calendar className='h-3 w-3 text-muted-foreground' />
							{formatDateTime(startTime)}
						</div>
					);
				},
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				cell: ({ row }) => {
					const booking = row.original;
					return (
						<div className='flex items-center gap-2 text-sm'>
							<Clock className='h-3 w-3 text-muted-foreground' />
							{calculateDuration(booking.startTime, booking.endTime)}
						</div>
					);
				},
			},
			{
				accessorKey: 'tokenCost',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Cost
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<Badge variant='outline' className='font-mono'>
						{row.getValue('tokenCost')} tokens
					</Badge>
				),
			},
			{
				accessorKey: 'status',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Status
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const status = row.getValue('status');
					return (
						<Badge variant={getStatusVariant(status)} className='capitalize'>
							{status}
						</Badge>
					);
				},
			},
			{
				accessorKey: 'createdAt',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Created
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<div className='text-sm'>{formatDate(row.getValue('createdAt'))}</div>
				),
			},
			{
				id: 'actions',
				enableHiding: false,
				cell: ({ row }) => {
					const booking = row.original;
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' className='h-8 w-8 p-0'>
									<span className='sr-only'>Open menu</span>
									<MoreHorizontal className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-48'>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem asChild>
									<Link href={`/admin/bookings/${booking._id}`}>
										<Edit className='mr-2 h-4 w-4' />
										Edit Booking
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<DropdownMenuItem
											className='text-red-600 focus:text-red-600 cursor-pointer'
											onSelect={(e) => e.preventDefault()}>
											<Trash2 className='mr-2 h-4 w-4' />
											Delete Booking
										</DropdownMenuItem>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Booking</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this booking for{' '}
												<strong>
													{booking.user?.firstName && booking.user?.lastName 
														? `${booking.user.firstName} ${booking.user.lastName}` 
														: 'Unknown User'}
												</strong>? This action cannot be
												undone and will refund the tokens if applicable.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => deleteBookingsMutation.mutate([booking._id])}
												className='bg-red-600 hover:bg-red-700'>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[deleteBookingsMutation]
	);

	// Initialize table
	const table = useReactTable({
		data: filteredBookings,
		columns,
		state: {
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		initialState: {
			pagination: {
				pageSize: 10,
			},
			sorting: [
				{
					id: 'createdAt',
					desc: true,
				},
			],
		},
	});

	// Get selected booking IDs
	const selectedBookingIds = React.useMemo(() => {
		return table
			.getFilteredSelectedRowModel()
			.rows.map((row) => row.original._id);
	}, [table, rowSelection]);

	if (isLoading) return <BookingsTableSkeleton />;

	if (isError) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center py-8'>
					<div className='text-center'>
						<p className='text-lg font-medium text-destructive'>
							Error loading bookings
						</p>
						<p className='text-sm text-muted-foreground mt-1'>
							{error?.message || 'Something went wrong'}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Bookings</CardTitle>
				<CardDescription>
					Manage all rack bookings in the system.
				</CardDescription>
				<CardAction>
					<Button size='sm' asChild>
						<Link href='/admin/bookings/add'>
							<Plus className='h-4 w-4' />
							Create Booking
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<div className='flex items-center gap-4'>
					<div className='relative flex-1 max-w-sm'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Search bookings, users, racks...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='pl-9'
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className='w-[160px]'>
							<SelectValue placeholder='All statuses' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All statuses</SelectItem>
							<SelectItem value='confirmed'>Confirmed</SelectItem>
							<SelectItem value='completed'>Completed</SelectItem>
							<SelectItem value='cancelled'>Cancelled</SelectItem>
							<SelectItem value='provisioning'>Provisioning</SelectItem>
						</SelectContent>
					</Select>
					{selectedBookingIds.length > 0 && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='destructive' size='sm'>
									<Trash2 className='h-4 w-4' />
									Delete ({selectedBookingIds.length})
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Bookings</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete {selectedBookingIds.length}{' '}
										booking(s)? This action cannot be undone and will refund tokens where applicable.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteBookingsMutation.mutate(selectedBookingIds)}
										className='bg-red-600 hover:bg-red-700'>
										Delete {selectedBookingIds.length} Bookings
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</div>

				<div className='overflow-hidden rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											className='[&:has([role=checkbox])]:pl-3'>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className='[&:has([role=checkbox])]:pl-3'>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'>
										No bookings found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className='flex items-center justify-end gap-2'>
					<div className='flex-1 text-sm text-muted-foreground'>
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}