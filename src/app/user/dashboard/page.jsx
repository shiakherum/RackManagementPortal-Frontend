'use client';

import { useStudentAuth } from '@/lib/student-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

import { StudentDashboard } from '@/components/student/dashboard/student-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function DashboardContent() {
	const { user, loading, isAuthenticated, refreshUser } = useStudentAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const refresh = searchParams.get('refresh');

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/user/login');
		}
	}, [loading, isAuthenticated, router]);

	// Refresh user data when component mounts or when refresh param is present
	useEffect(() => {
		if (isAuthenticated && refreshUser) {
			refreshUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<LoadingSpinner />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null; // Will redirect
	}

	return <StudentDashboard user={user} />;
}

export default function UserDashboardPage() {
	return (
		<Suspense fallback={<div className='flex min-h-screen items-center justify-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div></div>}>
			<DashboardContent />
		</Suspense>
	);
}