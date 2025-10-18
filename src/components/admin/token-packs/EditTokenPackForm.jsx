'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { AlertCircle, IndianRupee, Info, Loader2, Package } from 'lucide-react';

// Zod schema for validation
const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Pack name must be at least 3 characters.' }),
	description: z.string().min(10, { message: 'Description is required.' }),
	tokensGranted: z.coerce
		.number()
		.int()
		.positive({ message: 'Tokens must be a positive number.' }),
	price: z.coerce
		.number()
		.int()
		.positive({ message: 'Price must be a positive number.' }),
	currency: z.string().default('INR'),
	isActive: z.boolean().default(true),
});

export default function EditTokenPackForm({ pack }) {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: pack.name || '',
			description: pack.description || '',
			tokensGranted: pack.tokensGranted || 100,
			price: pack.price || 1000,
			currency: pack.currency || 'INR',
			isActive: pack.isActive ?? true,
		},
	});

	const updatePackMutation = useMutation({
		mutationFn: (updatedPackData) => {
			return api.patch(`/token-packs/${pack._id}`, updatedPackData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminTokenPacks'] });
			queryClient.invalidateQueries({ queryKey: ['adminTokenPack', pack._id] });
			router.push('/admin/token-packs');
		},
		onError: (error) => {
			setServerError(
				error.response?.data?.message || 'An unexpected error occurred.'
			);
		},
	});

	function onSubmit(values) {
		setServerError('');
		updatePackMutation.mutate(values);
	}

	return (
		<div className='max-w-7xl mx-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					{serverError && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Update Failed</AlertTitle>
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='h-5 w-5' />
								Package Details
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Package Name *</FormLabel>
										<FormControl>
											<Input placeholder='e.g., Starter Pack' {...field} />
										</FormControl>
										<FormDescription>
											A public name for this token package.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description *</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Briefly describe what this package offers...'
												className='min-h-[100px]'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Package className='h-5 w-5' />
								Tokens & Pricing
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='tokensGranted'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tokens Granted *</FormLabel>
											<FormControl>
												<Input type='number' placeholder='100' {...field} />
											</FormControl>
											<FormDescription>
												The number of tokens a user receives.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='price'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price (in smallest unit) *</FormLabel>
											<div className='relative'>
												<FormControl>
													<Input
														type='number'
														placeholder='1000'
														className='pl-8'
														{...field}
													/>
												</FormControl>
												<IndianRupee className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
											</div>
											<FormDescription>
												e.g., enter 1000 for ₹10.00.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='isActive'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
										<div className='space-y-0.5'>
											<FormLabel className='text-base'>Activate Pack</FormLabel>
											<FormDescription>
												If active, this pack will be visible to users for
												purchase.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-3'>
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/admin/token-packs')}>
							Cancel
						</Button>
						<Button type='submit' disabled={updatePackMutation.isPending}>
							{updatePackMutation.isPending ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
								</>
							) : (
								'Save Changes'
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
