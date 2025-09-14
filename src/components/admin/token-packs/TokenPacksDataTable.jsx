'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	ArrowUpDown,
	CheckCircle,
	MoreHorizontal,
	Search,
	Trash2,
	XCircle,
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

// Helper to format currency
const formatCurrency = (amount, currency = 'INR') => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: currency,
	}).format(amount / 100); // Assuming amount is in paise
};

export default function TokenPacksDataTable() {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const [sorting, setSorting] = React.useState([{ id: 'price', desc: true }]);
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [searchTerm, setSearchTerm] = React.useState('');
	const [statusFilter, setStatusFilter] = React.useState('all');
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [
			'adminTokenPacks',
			pagination,
			sorting,
			debouncedSearchTerm,
			statusFilter,
		],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const params = new URLSearchParams({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				sort:
					sorting.length > 0
						? `${sorting[0].desc ? '-' : ''}${sorting[0].id}`
						: '-price',
				...(debouncedSearchTerm && { search: debouncedSearchTerm }),
				...(statusFilter !== 'all' && { status: statusFilter }),
			});
			const response = await api.get(`/token-packs?${params.toString()}`);
			return response.data;
		},
		enabled: !!session?.accessToken,
	});

	const bulkDeleteMutation = useMutation({
		mutationFn: (packIds) => api.delete('/token-packs', { data: { packIds } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminTokenPacks'] });
			setRowSelection({});
		},
	});

	const bulkUpdateMutation = useMutation({
		mutationFn: ({ packIds, updateData }) =>
			api.patch('/token-packs', { packIds, updateData }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminTokenPacks'] });
			setRowSelection({});
		},
	});

	const deleteSingleMutation = useMutation({
		mutationFn: (packId) => api.delete(`/token-packs/${packId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminTokenPacks'] });
		},
	});

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
						aria-label='Select all'
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
				),
				enableSorting: false,
				size: 50,
			},
			{
				accessorKey: 'name',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-8 px-2 lg:px-3 justify-start'>
						Name
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<div className='font-medium px-2 text-left'>
						{row.getValue('name')}
					</div>
				),
			},
			{
				accessorKey: 'tokensGranted',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-8 px-2 lg:px-3 justify-start'>
						Tokens
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<div className='font-mono px-2 text-left'>
						{row.getValue('tokensGranted')}
					</div>
				),
				size: 120,
			},
			{
				accessorKey: 'price',
				header: ({ column }) => (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='h-8 px-2 lg:px-3 justify-start'>
						Price
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				),
				cell: ({ row }) => (
					<div className='font-medium px-2 text-left'>
						{formatCurrency(row.getValue('price'), row.original.currency)}
					</div>
				),
				size: 120,
			},
			{
				accessorKey: 'isActive',
				header: ({ column }) => <div className='px-2 text-left'>Status</div>,
				cell: ({ row }) => {
					const isActive = row.getValue('isActive');
					return (
						<div className='px-2 text-left'>
							<Badge variant={isActive ? 'default' : 'secondary'}>
								{isActive ? 'Active' : 'Inactive'}
							</Badge>
						</div>
					);
				},
				size: 100,
			},
			{
				id: 'actions',
				header: () => <div className='text-center px-2'>Actions</div>,
				cell: ({ row }) => (
					<div className='text-center px-2'>
						<AlertDialog>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' className='h-8 w-8 p-0'>
										<span className='sr-only'>Open menu</span>
										<MoreHorizontal className='h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem asChild>
										<Link href={`/admin/token-packs/${row.original._id}`}>
											Edit Pack
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<AlertDialogTrigger asChild>
										<DropdownMenuItem
											className='text-red-600 focus:text-red-600'
											onSelect={(e) => e.preventDefault()}>
											Delete
										</DropdownMenuItem>
									</AlertDialogTrigger>
								</DropdownMenuContent>
							</DropdownMenu>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete the{' '}
										<strong>{row.original.name}</strong> token pack.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() =>
											deleteSingleMutation.mutate(row.original._id)
										}
										className='bg-red-600 hover:bg-red-700'>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				),
				enableSorting: false,
				size: 80,
			},
		],
		[deleteSingleMutation]
	);

	const table = useReactTable({
		data: data?.data || [],
		columns,
		pageCount: data?.pagination?.totalPages ?? -1,
		state: { sorting, rowSelection, pagination },
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	});

	const selectedPackIds = React.useMemo(
		() =>
			table.getFilteredSelectedRowModel().rows.map((row) => row.original._id),
		[rowSelection, table]
	);

	if (isError) return <div>Error: {error.message}</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Token Packs</CardTitle>
				<CardDescription>
					Manage the token packages available for purchase.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col sm:flex-row items-center justify-between py-4 gap-2'>
					<div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
						<div className='relative flex-1 w-full sm:w-auto'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Search packs...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='pl-9 w-full'
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-full sm:w-[180px]'>
								<SelectValue placeholder='Filter by status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Statuses</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='inactive'>Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{selectedPackIds.length > 0 && (
						<div className='flex w-full sm:w-auto gap-2'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='outline'
										size='sm'
										className='w-full sm:w-auto'>
										Actions ({selectedPackIds.length})
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										onClick={() =>
											bulkUpdateMutation.mutate({
												packIds: selectedPackIds,
												updateData: { isActive: true },
											})
										}>
										<CheckCircle className='mr-2 h-4 w-4' /> Set Active
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											bulkUpdateMutation.mutate({
												packIds: selectedPackIds,
												updateData: { isActive: false },
											})
										}>
										<XCircle className='mr-2 h-4 w-4' /> Set Inactive
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<DropdownMenuItem
												onSelect={(e) => e.preventDefault()}
												className='text-red-600 focus:text-red-600'>
												Delete ({selectedPackIds.length})
											</DropdownMenuItem>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This will permanently delete {selectedPackIds.length}{' '}
													token pack(s).
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() =>
														bulkDeleteMutation.mutate(selectedPackIds)
													}
													className='bg-red-600 hover:bg-red-700'>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((hg) => (
								<TableRow key={hg.id}>
									{hg.headers.map((h) => (
										<TableHead
											key={h.id}
											style={{ width: h.column.columnDef.size }}>
											{h.isPlaceholder
												? null
												: flexRender(h.column.columnDef.header, h.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'>
										Loading token packs...
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												style={{ width: cell.column.columnDef.size }}>
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
										No token packs found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className='flex items-center justify-between space-x-2 py-4'>
					<div className='flex-1 text-sm text-muted-foreground'>
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{data?.pagination?.total || 0} row(s) selected.
					</div>
					<div className='flex items-center space-x-6 lg:space-x-8'>
						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Rows per page</p>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(v) => table.setPageSize(Number(v))}>
								<SelectTrigger className='h-8 w-[70px]'>
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side='top'>
									{[10, 20, 50, 100].map((s) => (
										<SelectItem key={s} value={`${s}`}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
							Page {table.getState().pagination.pageIndex + 1} of{' '}
							{table.getPageCount()}
						</div>
						<div className='flex items-center space-x-2'>
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
				</div>
			</CardContent>
		</Card>
	);
}
