'use client';

import { useStudentAuth } from '@/lib/student-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { StudentBookings } from '@/components/student/bookings/student-bookings';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function UserBookingsPage() {
	const { user, loading, isAuthenticated } = useStudentAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/user/login');
		}
	}, [loading, isAuthenticated, router]);

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

	return <StudentBookings user={user} />;
}