import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function ProtectedAdminLayout({ children }) {
	const session = await getServerSession(authOptions);

	// Security Gatekeeper
	if (!session || session.user?.role !== 'Admin') {
		redirect('/admin/login');
	}

	return (
		<SidebarProvider>
			<AdminSidebar session={session} />
			<SidebarInset>
				<AdminHeader session={session} />
				<div className='flex flex-1 flex-col gap-4 p-4 pt-0 bg-secondary'>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
