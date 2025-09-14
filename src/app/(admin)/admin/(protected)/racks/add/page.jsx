import AddRackForm from '@/components/admin/racks/AddRackForm';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddRackPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/racks'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Racks</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Create New Rack</h1>
					<p className='text-muted-foreground'>
						Add a new rack to the system with configuration details.
					</p>
				</div>
			</div>

			{/* Single Column Layout - Fixed Width */}
			<div className='max-w-7xl'>
				<Card>
					<CardHeader>
						<CardTitle>Rack Configuration</CardTitle>
						<CardDescription>
							Complete the form below to add a new rack to your inventory. All
							required fields are marked with *.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AddRackForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
