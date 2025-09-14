'use client';

import { PanelLeft } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';

export function StudentSiteHeader({ user }) {
	const { toggleSidebar } = useSidebar();

	return (
		<header className='bg-background sticky top-0 z-50 flex w-full items-center border-b'>
			<div className='flex h-[var(--header-height)] w-full items-center gap-2 px-4'>
				<Button
					className='h-8 w-8'
					variant='ghost'
					size='icon'
					onClick={toggleSidebar}>
					<PanelLeft />
				</Button>
				<Separator orientation='vertical' className='mr-2 h-4' />
				<Breadcrumb className='hidden sm:block'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href='/user/dashboard'>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Home</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className='ml-auto text-sm text-muted-foreground'>
					Welcome, {user.firstName}
				</div>
			</div>
		</header>
	);
}