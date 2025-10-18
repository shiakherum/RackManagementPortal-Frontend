'use client';

import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { StudentDashboard } from '@/components/student/dashboard/student-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function UserDashboardPage() {
	const { user, loading, isAuthenticated, refreshUser } = useStudentAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/user/login');
		}
	}, [loading, isAuthenticated, router]);

	// Refresh user data when component mounts (to get updated token balance)
	useEffect(() => {
		if (isAuthenticated && refreshUser) {
			refreshUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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