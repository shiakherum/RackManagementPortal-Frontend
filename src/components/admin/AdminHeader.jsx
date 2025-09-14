'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname) {
	const segments = pathname.split('/').filter(Boolean);
	const breadcrumbs = [];

	// Skip the first segment if it's 'admin'
	const startIndex = segments[0] === 'admin' ? 1 : 0;

	for (let i = startIndex; i < segments.length; i++) {
		const segment = segments[i];
		const href = '/' + segments.slice(0, i + 1).join('/');

		// Format segment name
		const name = segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		breadcrumbs.push({
			name,
			href,
			isLast: i === segments.length - 1,
		});
	}

	return breadcrumbs;
}

export default function AdminHeader({ session }) {
	const pathname = usePathname();
	const breadcrumbs = generateBreadcrumbs(pathname);

	return (
		<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-secondary'>
			<div className='flex items-center gap-2 px-4'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mr-2 data-[orientation=vertical]:h-4'
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className='hidden md:block'>
							<BreadcrumbLink asChild>
								<Link href='/admin/dashboard'>Admin Panel</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumbs.length > 0 && (
							<BreadcrumbSeparator className='hidden md:block' />
						)}
						{breadcrumbs.map((breadcrumb, index) => (
							<div key={breadcrumb.href} className='flex items-center gap-2'>
								{index > 0 && (
									<BreadcrumbSeparator className='hidden md:block' />
								)}
								<BreadcrumbItem>
									{breadcrumb.isLast ? (
										<BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link href={breadcrumb.href}>{breadcrumb.name}</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='ml-auto flex items-center gap-2 px-4'>
				<div className='relative'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search...'
						className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]'
					/>
				</div>
				<Button variant='ghost' size='sm' asChild>
					<Link
						href='/'
						className='text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm'>
						View Site
					</Link>
				</Button>
			</div>
		</header>
	);
}
