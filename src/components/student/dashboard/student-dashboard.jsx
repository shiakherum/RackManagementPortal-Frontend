'use client';

import { StudentAppSidebar } from '@/components/student/dashboard/student-app-sidebar';
import { StudentSiteHeader } from '@/components/student/dashboard/student-site-header';
import {
	SidebarInset,
	SidebarProvider,
} from '@/components/ui/sidebar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BookOpen,
	Calendar,
	CreditCard,
	Plus,
	Server,
} from 'lucide-react';

export function StudentDashboard({ user }) {
	return (
		<div className='[--header-height:calc(theme(spacing.14))]'>
			<SidebarProvider className='flex flex-col'>
				<StudentSiteHeader user={user} />
				<div className='flex flex-1'>
					<StudentAppSidebar user={user} />
					<SidebarInset>
						<div className='flex flex-1 flex-col gap-4 p-4 pt-6'>
							{/* Welcome Section */}
							<div className='mb-4'>
								<h2 className='text-2xl font-bold tracking-tight'>
									Welcome back, {user.firstName}!
								</h2>
								<p className='text-muted-foreground'>
									Manage your rack bookings and account details.
								</p>
							</div>

							{/* Stats Cards */}
							<div className='grid auto-rows-min gap-4 md:grid-cols-4'>
								{/* Tokens Balance */}
								<Card className='border-indigo-200 bg-indigo-50/50'>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium text-indigo-700'>
											Token Balance
										</CardTitle>
										<CreditCard className='h-4 w-4 text-indigo-600' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold text-indigo-900'>
											{user.tokens || 0}
										</div>
										<p className='text-xs text-indigo-600'>Available tokens</p>
									</CardContent>
								</Card>

								{/* Active Bookings */}
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Active Bookings
										</CardTitle>
										<Calendar className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>0</div>
										<p className='text-xs text-muted-foreground'>Currently active</p>
									</CardContent>
								</Card>

								{/* Total Bookings */}
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Total Bookings
										</CardTitle>
										<BookOpen className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>0</div>
										<p className='text-xs text-muted-foreground'>All time</p>
									</CardContent>
								</Card>

								{/* Available Racks */}
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											Available Racks
										</CardTitle>
										<Server className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>-</div>
										<p className='text-xs text-muted-foreground'>Ready to book</p>
									</CardContent>
								</Card>
							</div>

							{/* Quick Actions */}
							<div className='space-y-4'>
								<h3 className='text-lg font-medium'>Quick Actions</h3>
								<div className='grid gap-4 md:grid-cols-3'>
									<Card className='cursor-pointer transition-colors hover:bg-muted/50'>
										<CardHeader>
											<CardTitle className='flex items-center text-base'>
												<Plus className='mr-2 h-5 w-5 text-indigo-600' />
												New Booking
											</CardTitle>
											<CardDescription>
												Book a rack for your next lab session
											</CardDescription>
										</CardHeader>
									</Card>

									<Card className='cursor-pointer transition-colors hover:bg-muted/50'>
										<CardHeader>
											<CardTitle className='flex items-center text-base'>
												<Calendar className='mr-2 h-5 w-5 text-indigo-600' />
												View Bookings
											</CardTitle>
											<CardDescription>
												Manage your current and past bookings
											</CardDescription>
										</CardHeader>
									</Card>

									<Card className='cursor-pointer transition-colors hover:bg-muted/50'>
										<CardHeader>
											<CardTitle className='flex items-center text-base'>
												<CreditCard className='mr-2 h-5 w-5 text-indigo-600' />
												Buy Tokens
											</CardTitle>
											<CardDescription>
												Purchase more tokens for your account
											</CardDescription>
										</CardHeader>
									</Card>
								</div>
							</div>

							{/* Recent Activity */}
							<Card className='min-h-[50vh]'>
								<CardHeader>
									<CardTitle>Recent Activity</CardTitle>
									<CardDescription>
										Your latest bookings and account activity
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-center py-16 text-muted-foreground'>
										<div className='text-center'>
											<Calendar className='mx-auto h-12 w-12 text-muted-foreground/50' />
											<h3 className='mt-2 text-sm font-medium'>
												No recent activity
											</h3>
											<p className='mt-1 text-sm text-muted-foreground'>
												Your booking history will appear here.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
}