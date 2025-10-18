'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import DynamicListInput from '@/components/admin/shared/DynamicListInput';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import {
	AlertCircle,
	CheckCircle,
	ImageIcon,
	Info,
	Loader2,
	Package,
	Upload,
	X,
} from 'lucide-react';
import KeyValueListInput from './KeyValueListInput';

// Enhanced Zod schema for editing
const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Rack name must be at least 3 characters.' })
		.max(100, { message: 'Rack name must be less than 100 characters.' }),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters.' })
		.max(1000, { message: 'Description must be less than 1000 characters.' }),
	deviceId: z
		.string()
		.min(1, { message: 'Device ID is required.' })
		.max(50, { message: 'Device ID must be less than 50 characters.' }),
	status: z.enum(['available', 'not available']),
	availableAciVersions: z.array(z.string()).default([]),
	preConfigOptions: z.array(z.string()).default([]),
	topologyDiagram: z.string().optional(),
	topologyHtmlMap: z.string().optional(),
	titleFeature: z.string().optional(),
	specifications: z
		.array(z.object({ specName: z.string(), specValue: z.string() }))
		.default([]),
	featuresList: z.array(z.string()).default([]),
	ctaFinalLine: z.string().optional(),
	tokenCostPerHour: z.coerce.number().min(0).default(0),
});

export default function EditRackForm({ rackId }) {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');
	const [uploadingImage, setUploadingImage] = React.useState(false);
	const [uploadSuccess, setUploadSuccess] = React.useState(false);
	const fileInputRef = React.useRef(null);

	const { data: rackData, isLoading: isRackLoading } = useQuery({
		queryKey: ['adminRack', rackId],
		queryFn: async () => {
			if (!session?.accessToken) throw new Error('Not authenticated');
			const response = await api.get(`/racks/${rackId}`);
			return response.data.data;
		},
		enabled: !!session?.accessToken,
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			deviceId: '',
			status: 'available',
			availableAciVersions: [],
			preConfigOptions: [],
			topologyDiagram: '',
			topologyHtmlMap: '',
			titleFeature: '',
			specifications: [],
			featuresList: [],
			ctaFinalLine: '',
			tokenCostPerHour: 0,
		},
	});

	React.useEffect(() => {
		if (rackData) {
			form.reset(rackData);
		}
	}, [rackData, form]);

	const topologyDiagramValue = form.watch('topologyDiagram');

	const getImageDisplayUrl = (imageUrl) => {
		if (!imageUrl) return '';
		if (imageUrl.startsWith('http')) return imageUrl;
		return `${process.env.NEXT_PUBLIC_API_STATIC_URL || 'https://localhost:5443'}${imageUrl}`;
	};

	const updateRackMutation = useMutation({
		mutationFn: (updatedRackData) => {
			const changedData = Object.keys(updatedRackData).reduce((acc, key) => {
				if (updatedRackData[key] !== rackData[key]) {
					acc[key] = updatedRackData[key];
				}
				return acc;
			}, {});

			return api.patch(`/racks/${rackId}`, changedData, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminRacks'] });
			queryClient.invalidateQueries({ queryKey: ['adminRack', rackId] });
			router.push('/admin/racks');
		},
		onError: (error) => {
			setServerError(error.response?.data?.message || 'An unexpected error occurred.');
		},
	});

	const handleImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		if (!allowedTypes.includes(file.type)) {
			setServerError('Please upload a PNG or JPG image.');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setServerError('Image size must be less than 5MB.');
			return;
		}

		setUploadingImage(true);
		setServerError('');
		setUploadSuccess(false);

		const formData = new FormData();
		formData.append('image', file);

		try {
			const response = await api.post('/upload/topology-diagram', formData);

			const imageUrl = response.data.data.imageUrl;
			form.setValue('topologyDiagram', imageUrl);
			setUploadSuccess(true);
			setTimeout(() => setUploadSuccess(false), 3000);
		} catch (error) {
			setServerError(error.response?.data?.message || 'Failed to upload image.');
		} finally {
			setUploadingImage(false);
		}
	};

	const removeImage = () => {
		form.setValue('topologyDiagram', '');
		setUploadSuccess(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	function onSubmit(values) {
		setServerError('');
		updateRackMutation.mutate(values);
	}

	if (isRackLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='max-w-7xl mx-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					{serverError && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='h-5 w-5' />
								Basic Information
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Rack Name *</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='deviceId'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Device ID *</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description *</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='available'>Available</SelectItem>
												<SelectItem value='not available'>Not Available</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='h-5 w-5' />
								Marketing Details
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<FormField
								control={form.control}
								name='titleFeature'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title Feature</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='tokenCostPerHour'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Token Cost Per Hour</FormLabel>
										<FormControl>
											<Input type='number' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='specifications'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Specifications</FormLabel>
										<FormControl>
											<KeyValueListInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='featuresList'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Features List</FormLabel>
										<FormControl>
											<DynamicListInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='ctaFinalLine'
								render={({ field }) => (
									<FormItem>
										<FormLabel>CTA Final Line</FormLabel>
										<FormControl>
											<Input {...field} />
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
								Configuration Options
							</CardTitle>
						</CardHeader>
						<CardContent className='grid grid-cols-1 items-start lg:grid-cols-2 gap-8'>
							<FormField
								control={form.control}
								name='availableAciVersions'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Available ACI Versions</FormLabel>
										<FormControl>
											<DynamicListInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='preConfigOptions'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pre-Config Options</FormLabel>
										<FormControl>
											<DynamicListInput {...field} />
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
								<ImageIcon className='h-5 w-5' />
								Topology Configuration
							</CardTitle>
						</CardHeader>
						<CardContent className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8'>
							<FormField
								control={form.control}
								name='topologyDiagram'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topology Diagram</FormLabel>
										<FormControl>
											<div className='space-y-4'>
												{topologyDiagramValue ? (
													<div className='relative group'>
														<div className='rounded-lg border-2 border-dashed border-green-200 bg-green-50/50 p-4 transition-all duration-200'>
															<img
																src={getImageDisplayUrl(topologyDiagramValue)}
																alt='Topology Diagram'
																className='max-w-full h-auto rounded-md shadow-sm'
															/>
															<Button
																type='button'
																variant='destructive'
																size='icon'
																className='absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
																onClick={removeImage}>
																<X className='h-4 w-4' />
															</Button>
														</div>
														{uploadSuccess && (
															<div className='flex items-center gap-2 text-sm text-green-600 mt-2'>
																<CheckCircle className='h-4 w-4' />
																Image uploaded successfully!
															</div>
														)}
													</div>
												) : (
													<div
														className='relative rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary/50 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group'
														onClick={() => fileInputRef.current?.click()}>
														{uploadingImage ? (
															<div className='flex flex-col items-center gap-3'>
																<Loader2 className='h-8 w-8 text-primary animate-spin' />
																<p className='text-sm text-gray-600 font-medium'>
																	Uploading image...
																</p>
															</div>
														) : (
															<div className='flex flex-col items-center gap-3'>
																<div className='p-3 bg-gray-100 rounded-full group-hover:bg-primary/10 transition-colors duration-200'>
																	<Upload className='h-8 w-8 text-gray-400 group-hover:text-primary transition-colors duration-200' />
																</div>
																<div>
																	<p className='text-sm font-medium text-gray-900'>
																		<span className='text-primary hover:text-primary/80 transition-colors duration-200'>
																			Click to upload
																		</span>{' '}
																		or drag and drop
																	</p>
																	<p className='text-xs text-gray-500 mt-1'>
																		PNG, JPG up to 5MB
																	</p>
																</div>
															</div>
														)}
													</div>
												)}
												<input
													ref={fileInputRef}
													type='file'
													accept='image/png,image/jpeg,image/jpg'
													onChange={handleImageUpload}
													className='hidden'
													disabled={uploadingImage}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='topologyHtmlMap'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topology HTML Map</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className='flex justify-end gap-3'>
						<Button variant='outline' type='button' onClick={() => router.push('/admin/racks')}>
							Cancel
						</Button>
						<Button type='submit' disabled={updateRackMutation.isPending || uploadingImage}>
							{updateRackMutation.isPending ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Updating Rack...
								</>
							) : (
								'Update Rack'
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
