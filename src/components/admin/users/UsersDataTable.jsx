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
	AtSign,
	Mail,
	MoreHorizontal,
	Search,
	ShieldCheck,
	ShieldX,
	Trash2,
	UserPlus,
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

// Define role variants for consistent styling
const getRoleVariant = (role) => {
	switch (role) {
		case 'Admin':
			return 'default';
		case 'Power User':
			return 'secondary';
		case 'Standard User':
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

// Loading skeleton component
function UsersTableSkeleton() {
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
							<Skeleton className='h-10 w-10 rounded-full' />
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

export default function UsersDataTable() {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	// Local state for filtering and pagination
	const [searchTerm, setSearchTerm] = React.useState('');
	const [roleFilter, setRoleFilter] = React.useState('all');
	const [rowSelection, setRowSelection] = React.useState({});
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// Fetch users data
	const {
		data: users = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['adminUsers'],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get('/admin/users', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data || [];
		},
		enabled: !!session?.accessToken,
	});

	// Filter users based on search and role
	const filteredUsers = React.useMemo(() => {
		return users.filter((user) => {
			const searchLower = debouncedSearchTerm.toLowerCase();
			const matchesSearch =
				!debouncedSearchTerm ||
				user.name?.toLowerCase().includes(searchLower) ||
				user.email?.toLowerCase().includes(searchLower) ||
				user.username?.toLowerCase().includes(searchLower);

			const matchesRole = roleFilter === 'all' || user.role === roleFilter;

			return matchesSearch && matchesRole;
		});
	}, [users, debouncedSearchTerm, roleFilter]);

	// Delete users mutation
	const deleteUsersMutation = useMutation({
		mutationFn: async (userIds) => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			return api.delete('/admin/users', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
				data: { userIds },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['adminUsers']);
			setRowSelection({});
			console.log('Users deleted successfully!');
		},
		onError: (error) => {
			console.error(
				'Error deleting users:',
				error.response?.data?.message || error.message
			);
		},
	});

	// Table columns definition - Clean headers like shadcn examples
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
						aria-label='Select all users'
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label='Select user'
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: 'name',
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
					const user = row.original;
					return (
						<div className='flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold'>
								{user.name?.[0]?.toUpperCase() || 'U'}
							</div>
							<div className='grid gap-0.5'>
								<div className='font-medium'>{user.name}</div>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<div className='flex items-center gap-1'>
										<Mail className='h-3 w-3' />
										{user.email}
									</div>
									{user.isEmailVerified ? (
										<div className='flex items-center gap-1 text-green-600'>
											<ShieldCheck className='h-3 w-3' />
											<span className='text-xs'>Verified</span>
										</div>
									) : (
										<div className='flex items-center gap-1 text-amber-600'>
											<ShieldX className='h-3 w-3' />
											<span className='text-xs'>Unverified</span>
										</div>
									)}
								</div>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'username',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Username
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const username = row.getValue('username');
					return (
						<div className='flex items-center gap-1 text-sm font-mono'>
							<AtSign className='h-3 w-3 text-muted-foreground' />
							{username}
						</div>
					);
				},
			},
			{
				accessorKey: 'role',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Role
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => {
					const role = row.getValue('role');
					return (
						<Badge variant={getRoleVariant(role)} className='font-medium'>
							{role}
						</Badge>
					);
				},
			},
			{
				accessorKey: 'tokens',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-auto p-0 hover:bg-transparent'>
						Tokens
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<div className='text-center'>
						<Badge variant='outline' className='font-mono'>
							{row.getValue('tokens')}
						</Badge>
					</div>
				),
			},

			{
				accessorKey: 'isActive',
				header: 'Status',
				cell: ({ row }) => {
					const isActive = row.getValue('isActive');
					return (
						<Badge variant={isActive ? 'default' : 'secondary'}>
							{isActive ? 'Active' : 'Inactive'}
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
						Joined
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
					const user = row.original;
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
									<Link href={`/admin/users/${user._id}`}>Edit User</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>Reset Password</DropdownMenuItem>
								{!user.isEmailVerified && (
									<DropdownMenuItem>Resend Verification</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<DropdownMenuItem
											className='text-red-600 focus:text-red-600 cursor-pointer'
											onSelect={(e) => e.preventDefault()}>
											Delete User
										</DropdownMenuItem>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete User</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete{' '}
												<strong>{user.name}</strong>? This action cannot be
												undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => deleteUsersMutation.mutate([user._id])}
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
		[deleteUsersMutation]
	);

	// Initialize table
	const table = useReactTable({
		data: filteredUsers,
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

	// Get selected user IDs
	const selectedUserIds = React.useMemo(() => {
		return table
			.getFilteredSelectedRowModel()
			.rows.map((row) => row.original._id);
	}, [table, rowSelection]);

	if (isLoading) return <UsersTableSkeleton />;

	if (isError) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center py-8'>
					<div className='text-center'>
						<p className='text-lg font-medium text-destructive'>
							Error loading users
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
				<CardTitle>Users</CardTitle>
				<CardDescription>
					Manage all registered users in the system.
				</CardDescription>
				<CardAction>
					<Button size='sm' asChild>
						<Link href='/admin/users/add'>
							<UserPlus className='h-4 w-4' />
							Add User
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<div className='flex items-center gap-4'>
					<div className='relative flex-1 max-w-sm'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Search users, emails, usernames...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='pl-9'
						/>
					</div>
					<Select value={roleFilter} onValueChange={setRoleFilter}>
						<SelectTrigger className='w-[160px]'>
							<SelectValue placeholder='All roles' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All roles</SelectItem>
							<SelectItem value='Admin'>Admin</SelectItem>
							<SelectItem value='Power User'>Power User</SelectItem>
							<SelectItem value='Standard User'>Standard User</SelectItem>
						</SelectContent>
					</Select>
					{selectedUserIds.length > 0 && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='destructive' size='sm'>
									<Trash2 className='h-4 w-4' />
									Delete ({selectedUserIds.length})
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Users</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete {selectedUserIds.length}{' '}
										user(s)? This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteUsersMutation.mutate(selectedUserIds)}
										className='bg-red-600 hover:bg-red-700'>
										Delete {selectedUserIds.length} Users
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
										No results.
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
