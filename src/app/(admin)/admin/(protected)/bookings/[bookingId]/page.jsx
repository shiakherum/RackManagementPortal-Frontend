'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import EditBookingForm from '@/components/admin/bookings/EditBookingForm';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function EditBookingPage() {
	const params = useParams();
	const bookingId = params.bookingId;

	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/bookings'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Bookings</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Edit Booking</h1>
					<p className='text-muted-foreground'>
						Update booking details and configuration.
					</p>
				</div>
			</div>

			{/* Single Column Layout - Fixed Width */}
			<div className='max-w-4xl'>
				<Card>
					<CardHeader>
						<CardTitle>Booking Details</CardTitle>
						<CardDescription>
							Update the booking information below.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<EditBookingForm bookingId={bookingId} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
