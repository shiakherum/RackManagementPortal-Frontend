import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, User } from 'lucide-react';

export default function DashboardTable({ upcomingBookings }) {
	if (!upcomingBookings || upcomingBookings.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Bookings</CardTitle>
					<CardDescription>No upcoming bookings found.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Bookings</CardTitle>
				<CardDescription>
					Next {upcomingBookings.length} scheduled lab sessions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='overflow-hidden rounded-lg border'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[200px]'>
									<div className='flex items-center gap-2'>
										<User className='h-4 w-4' />
										User
									</div>
								</TableHead>
								<TableHead>
									<div className='flex items-center gap-2'>
										<Calendar className='h-4 w-4' />
										Rack
									</div>
								</TableHead>
								<TableHead>
									<div className='flex items-center gap-2'>
										<Clock className='h-4 w-4' />
										Start Time
									</div>
								</TableHead>
								<TableHead className='text-right'>Duration</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{upcomingBookings.map((booking) => {
								const startTime = new Date(booking.startTime);
								const endTime = booking.endTime
									? new Date(booking.endTime)
									: null;
								const duration = endTime
									? Math.round((endTime - startTime) / (1000 * 60 * 60))
									: 'N/A';

								return (
									<TableRow key={booking._id} className='hover:bg-muted/50'>
										<TableCell className='font-medium'>
											<div className='flex items-center gap-2'>
												<div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
													{booking.user.name?.[0]?.toUpperCase() || 'U'}
												</div>
												<div>
													<div className='font-medium'>{booking.user.name}</div>
													<div className='text-xs text-muted-foreground'>
														{booking.user.email}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Badge variant='outline' className='font-mono'>
													{booking.rack.name}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className='space-y-1'>
												<div className='font-medium'>
													{startTime.toLocaleDateString()}
												</div>
												<div className='text-sm text-muted-foreground'>
													{startTime.toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</div>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<Badge variant='secondary'>{duration}h</Badge>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
