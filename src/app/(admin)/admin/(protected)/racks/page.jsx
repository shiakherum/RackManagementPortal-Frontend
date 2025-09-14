import { Download, PlusCircle } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RacksDataTable from '@/components/admin/racks/RacksDataTable';
import { Button } from '@/components/ui/button';

export default async function AdminRacksPage() {
	const session = await getServerSession(authOptions);

	// Security Gatekeeper
	if (!session || session.user?.role !== 'Admin') {
		redirect('/admin/login');
	}

	return (
		<div className='flex flex-1 flex-col gap-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Rack Management</h1>
					<p className='text-muted-foreground'>
						Configure and monitor all physical and virtual racks in your
						inventory.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' className='gap-2'>
						<Download className='h-4 w-4' />
						Export Racks
					</Button>
					<Button size='sm' className='gap-2' asChild>
						<Link href='/admin/racks/add'>
							<PlusCircle className='h-4 w-4' />
							Add New Rack
						</Link>
					</Button>
				</div>
			</div>
			<RacksDataTable />
		</div>
	);
}
