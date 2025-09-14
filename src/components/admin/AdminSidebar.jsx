'use client';

import {
	BookCopy,
	ChevronRight,
	Home,
	MoreHorizontal,
	Package,
	Server,
	Settings,
	Users2,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from '@/components/ui/sidebar';

const navMain = [
	{
		title: 'Dashboard',
		url: '/admin/dashboard',
		icon: Home,
		isActive: true,
	},
	{
		title: 'User Management',
		url: '/admin/users',
		icon: Users2,
		items: [
			{
				title: 'All Users',
				url: '/admin/users',
			},
			{
				title: 'Add User',
				url: '/admin/users/add',
			},
		],
	},
	{
		title: 'Rack Management',
		url: '/admin/racks',
		icon: Server,
		items: [
			{
				title: 'All Racks',
				url: '/admin/racks',
			},
			{
				title: 'Add Rack',
				url: '/admin/racks/add',
			},
		],
	},
	{
		title: 'Token Packs',
		url: '/admin/token-packs',
		icon: Package,
		items: [
			{
				title: 'All Packs',
				url: '/admin/token-packs',
			},
			{
				title: 'Add Pack',
				url: '/admin/token-packs/add',
			},
		],
	},
	{
		title: 'Bookings',
		url: '/admin/bookings',
		icon: BookCopy,
		items: [
			{
				title: 'All Bookings',
				url: '/admin/bookings',
			},
			{
				title: 'Create Booking',
				url: '/admin/bookings/add',
			},
		],
	},
];

const navSecondary = [
	{
		title: 'Settings',
		url: '/admin/settings',
		icon: Settings,
	},
];

export default function AdminSidebar({ session, ...props }) {
	const { isMobile } = useSidebar();
	const pathname = usePathname();

	return (
		<Sidebar collapsible='icon' {...props} className='bg-background'>
			<SidebarHeader className='bg-background'>
				<SidebarMenu className='bg-background'>
					<SidebarMenuItem className='bg-background'>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/admin/dashboard'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground'>
									<img src='/ideogram.svg' alt='Logo' className='size-6' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										ACI Rack Management
									</span>
									<span className='truncate text-xs'>Administration</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className='bg-background'>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						{navMain.map((item) => (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={pathname.startsWith(item.url)}
								className='group/collapsible'>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											tooltip={item.title}
											isActive={pathname.startsWith(item.url)}
											asChild={!item.items}>
											{item.items ? (
												<>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
												</>
											) : (
												<Link href={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</Link>
											)}
										</SidebarMenuButton>
									</CollapsibleTrigger>
									{item.items && (
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={pathname === subItem.url}>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									)}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className='mt-auto bg-background'>
					<SidebarGroupLabel>System</SidebarGroupLabel>
					<SidebarMenu>
						{navSecondary.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									isActive={pathname === item.url}
									asChild>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='bg-background'>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size='lg'
									className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
									<Avatar className='h-8 w-8 rounded-lg'>
										<AvatarImage
											src={session?.user?.image}
											alt={session?.user?.name}
										/>
										<AvatarFallback className='rounded-lg'>
											{session?.user?.name?.[0]?.toUpperCase() || 'A'}
										</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-medium'>
											{session?.user?.name || 'Admin'}
										</span>
										<span className='truncate text-xs'>
											{session?.user?.email || 'admin@example.com'}
										</span>
									</div>
									<MoreHorizontal className='ml-auto size-4' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
								side={isMobile ? 'bottom' : 'right'}
								align='end'
								sideOffset={4}>
								<DropdownMenuLabel className='p-0 font-normal'>
									<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
										<Avatar className='h-8 w-8 rounded-lg'>
											<AvatarImage
												src={session?.user?.image}
												alt={session?.user?.name}
											/>
											<AvatarFallback className='rounded-lg'>
												{session?.user?.name?.[0]?.toUpperCase() || 'A'}
											</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-medium'>
												{session?.user?.name || 'Admin'}
											</span>
											<span className='truncate text-xs'>
												{session?.user?.email || 'admin@example.com'}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className='mr-2 h-4 w-4' />
									Account Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => signOut({ callbackUrl: '/admin/login' })}
									className='text-red-600 focus:text-red-600'>
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
