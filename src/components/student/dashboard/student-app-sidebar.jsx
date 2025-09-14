'use client';

import * as React from 'react';
import {
	BookOpen,
	Calendar,
	CreditCard,
	LifeBuoy,
	Send,
	Server,
	Settings2,
	SquareTerminal,
} from 'lucide-react';

import { StudentNavMain } from '@/components/student/dashboard/student-nav-main';
import { StudentNavSecondary } from '@/components/student/dashboard/student-nav-secondary';
import { StudentNavUser } from '@/components/student/dashboard/student-nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
	navMain: [
		{
			title: 'Dashboard',
			url: '/user/dashboard',
			icon: SquareTerminal,
			isActive: true,
		},
		{
			title: 'Bookings',
			url: '/user/bookings',
			icon: Calendar,
			items: [
				{
					title: 'My Bookings',
					url: '/user/bookings',
				},
				{
					title: 'New Booking',
					url: '/user/bookings/new',
				},
				{
					title: 'History',
					url: '/user/bookings/history',
				},
			],
		},
		{
			title: 'Available Racks',
			url: '/user/racks',
			icon: Server,
			items: [
				{
					title: 'Browse Racks',
					url: '/user/racks',
				},
				{
					title: 'Rack Details',
					url: '/user/racks/details',
				},
			],
		},
		{
			title: 'Token Management',
			url: '/user/tokens',
			icon: CreditCard,
			items: [
				{
					title: 'Buy Tokens',
					url: '/user/tokens/buy',
				},
				{
					title: 'Transaction History',
					url: '/user/tokens/history',
				},
			],
		},
		{
			title: 'Documentation',
			url: '/user/docs',
			icon: BookOpen,
			items: [
				{
					title: 'Getting Started',
					url: '/user/docs/getting-started',
				},
				{
					title: 'User Guide',
					url: '/user/docs/user-guide',
				},
				{
					title: 'FAQ',
					url: '/user/docs/faq',
				},
			],
		},
		{
			title: 'Settings',
			url: '/user/settings',
			icon: Settings2,
			items: [
				{
					title: 'Profile',
					url: '/user/settings/profile',
				},
				{
					title: 'Preferences',
					url: '/user/settings/preferences',
				},
				{
					title: 'Security',
					url: '/user/settings/security',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Support',
			url: '/user/support',
			icon: LifeBuoy,
		},
		{
			title: 'Feedback',
			url: '/user/feedback',
			icon: Send,
		},
	],
};

export function StudentAppSidebar({ user, ...props }) {
	return (
		<Sidebar
			className='top-[var(--header-height)] h-[calc(100svh-var(--header-height))]'
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<a href='/user/dashboard'>
								<div className='bg-indigo-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg'>
									<Server className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>ACI Rack Rentals</span>
									<span className='truncate text-xs'>Student Portal</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<StudentNavMain items={data.navMain} />
				<StudentNavSecondary items={data.navSecondary} className='mt-auto' />
			</SidebarContent>
			<SidebarFooter>
				<StudentNavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}