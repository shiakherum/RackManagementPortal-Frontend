'use client';

import EditRackForm from '@/components/admin/racks/EditRackForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditRackPage() {
	const params = useParams();
	const { rackId } = params;

	return (
		<div className='flex flex-1 flex-col gap-6'>
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/racks'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Racks</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Edit Rack</h1>
					<p className='text-muted-foreground'>
						Modify the configuration details for this rack.
					</p>
				</div>
			</div>

			<div className='max-w-7xl'>
				<EditRackForm rackId={rackId} />
			</div>
		</div>
	);
}