import AddTokenPackForm from '@/components/admin/token-packs/AddTokenPackForm';
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

export default function AddTokenPackPage() {
	return (
		<div className='flex flex-1 flex-col gap-6'>
			{/* Header Section */}
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-9 w-9' asChild>
					<Link href='/admin/token-packs'>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Back to Token Packs</span>
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Create New Token Pack
					</h1>
					<p className='text-muted-foreground'>
						Add a new token package that will be available for users to
						purchase.
					</p>
				</div>
			</div>

			{/* Single Column Layout - Fixed Width */}
			<div className='max-w-4xl'>
				<Card>
					<CardHeader>
						<CardTitle>Token Pack Configuration</CardTitle>
						<CardDescription>
							Complete the form below to create a new token package for
							purchase. All required fields are marked with *.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AddTokenPackForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
