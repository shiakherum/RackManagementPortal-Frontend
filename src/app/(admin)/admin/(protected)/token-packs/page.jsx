import TokenPacksDataTable from '@/components/admin/token-packs/TokenPacksDataTable';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminTokenPacksPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Token Pack Management
					</h1>
					<p className='text-muted-foreground'>
						Create, manage, and track the performance of token packages.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' className='gap-2'>
						<Download className='h-4 w-4' />
						Export Packs
					</Button>
					{/* This button is now a Link */}
					<Button size='sm' className='gap-2' asChild>
						<Link href='/admin/token-packs/add'>
							<PlusCircle className='h-4 w-4' />
							Add New Pack
						</Link>
					</Button>
				</div>
			</div>
			<TokenPacksDataTable />
		</div>
	);
}
