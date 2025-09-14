'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import DashboardChart from '@/components/admin/DashboardChart';
import DashboardStats from '@/components/admin/DashboardStats';
import DashboardTable from '@/components/admin/DashboardTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { AlertCircle } from 'lucide-react';

// Loading skeleton component for dashboard
function DashboardSkeleton() {
	return (
		<div className='flex flex-1 flex-col gap-4'>
			{/* Stats Cards Skeleton */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className='rounded-lg border p-6'>
						<div className='flex items-center space-x-2'>
							<Skeleton className='h-4 w-4' />
							<Skeleton className='h-4 w-24' />
						</div>
						<Skeleton className='mt-2 h-8 w-16' />
						<Skeleton className='mt-2 h-3 w-32' />
					</div>
				))}
			</div>

			{/* Charts and Tables Skeleton */}
			<div className='grid gap-4 lg:grid-cols-3'>
				<div className='lg:col-span-2'>
					<Skeleton className='h-96 w-full' />
				</div>
				<div className='flex flex-col gap-4'>
					<Skeleton className='h-48 w-full' />
				</div>
			</div>

			{/* Table Skeleton */}
			<Skeleton className='h-64 w-full' />
		</div>
	);
}

export default function DashboardPage() {
	const { data: session } = useSession();

	// Fetch dashboard stats using React Query
	const {
		data: stats,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['dashboardStats'],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get('/admin/dashboard-stats', {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
			return response.data.data || null;
		},
		enabled: !!session?.accessToken,
		retry: 1,
	});

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (isError || !stats) {
		return (
			<div className='flex flex-1 flex-col gap-4'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error Loading Dashboard</AlertTitle>
					<AlertDescription>
						{error?.message || 'Unable to load dashboard data. Please try refreshing the page or contact support if the problem persists.'}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			{/* Stats Cards */}
			<DashboardStats stats={stats} />

			{/* Charts and Tables */}
			<div className='grid gap-4 lg:grid-cols-3'>
				{/* Chart takes 2 columns */}
				<div className='lg:col-span-2'>
					<DashboardChart />
				</div>

				{/* Quick Actions or Recent Activity */}
				<div className='flex flex-col gap-4'>
					{/* You can add quick action cards here */}
					<div className='grid gap-4'>
						{/* Placeholder for additional widgets */}
					</div>
				</div>
			</div>

			{/* Upcoming Bookings Table */}
			<DashboardTable upcomingBookings={stats.upcomingBookings} />
		</div>
	);
}
