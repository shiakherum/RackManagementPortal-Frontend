'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import DynamicListInput from '@/components/admin/shared/DynamicListInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import {
	AlertCircle,
	CheckCircle,
	FileImage,
	Image as ImageIcon,
	Info,
	Loader2,
	Package,
	Upload,
	X,
} from 'lucide-react';

import KeyValueListInput from '@/components/admin/racks/KeyValueListInput';

// Enhanced Zod schema
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

export default function AddRackForm() {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = React.useState('');
	const [uploadingImage, setUploadingImage] = React.useState(false);
	const [uploadSuccess, setUploadSuccess] = React.useState(false);
	const fileInputRef = React.useRef(null);

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

	const topologyDiagramValue = form.watch('topologyDiagram');

	// Helper function to get the full image URL for display
	const getImageDisplayUrl = (imageUrl) => {
		if (!imageUrl) return '';
		if (imageUrl.startsWith('http')) return imageUrl;
		// Use NEXT_PUBLIC_API_STATIC_URL for static files, not the API URL
		return `${
			process.env.NEXT_PUBLIC_API_STATIC_URL || 'https://localhost:5443'
		}${imageUrl}`;
	};

	const createRackMutation = useMutation({
		mutationFn: (newRackData) => {
			return api.post('/racks', newRackData, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminRacks'] });
			router.push('/admin/racks');
		},
		onError: (error) => {
			setServerError(
				error.response?.data?.message || 'An unexpected error occurred.'
			);
		},
	});

	const handleImageUpload = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		if (!allowedTypes.includes(file.type)) {
			setServerError('Please upload a PNG or JPG image.');
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			setServerError('Image size must be less than 5MB.');
			return;
		}

		// Ensure we're in the browser
		if (typeof window === 'undefined') {
			setServerError('Upload must be done from browser.');
			return;
		}

		setUploadingImage(true);
		setServerError('');
		setUploadSuccess(false);

		const formData = new FormData();
		formData.append('image', file);

		console.log('=== Frontend Upload Debug ===');
		console.log('typeof window:', typeof window);
		console.log('File object:', file);
		console.log('FormData:', formData);
		console.log('Token:', session?.accessToken);

		// Use XMLHttpRequest to ensure browser-side upload with proper multipart/form-data
		const xhr = new XMLHttpRequest();
		const token = session?.accessToken;

		// Use the API URL - the Next.js proxy will now handle multipart correctly
		const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/upload/topology-diagram`;
		xhr.open('POST', uploadUrl, true);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		// Don't set Content-Type - browser will set it automatically with boundary

		xhr.onload = function() {
			setUploadingImage(false);
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					const imageUrl = response.data.imageUrl;
					form.setValue('topologyDiagram', imageUrl);
					setUploadSuccess(true);
					setTimeout(() => setUploadSuccess(false), 3000);
				} catch (error) {
					setServerError('Failed to parse upload response.');
				}
			} else {
				try {
					const response = JSON.parse(xhr.responseText);
					setServerError(response.message || 'Failed to upload image.');
				} catch (error) {
					setServerError('Failed to upload image.');
				}
			}
		};

		xhr.onerror = function() {
			setUploadingImage(false);
			setServerError('Failed to upload image.');
		};

		console.log('Sending XHR request...');
		xhr.send(formData);
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
		createRackMutation.mutate(values);
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

					{/* Basic Information Card */}
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
												<Input
													placeholder='e.g., ACI Pod 1'
													{...field}
													className='transition-all duration-200 focus:ring-2 focus:ring-primary/20'
												/>
											</FormControl>
											<FormDescription>
												A unique, descriptive name for this rack
											</FormDescription>
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
												<Input
													placeholder='unique-hardware-identifier'
													{...field}
													className='font-mono transition-all duration-200 focus:ring-2 focus:ring-primary/20'
												/>
											</FormControl>
											<FormDescription>
												Hardware identifier for this rack
											</FormDescription>
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
											<Textarea
												placeholder="Describe the rack's purpose, hardware specifications, and any special notes..."
												className='min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Detailed information about this rack's capabilities and
											purpose
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Initial Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='max-w-xs transition-all duration-200 focus:ring-2 focus:ring-primary/20'>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='available'>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 bg-green-500 rounded-full'></div>
														Available
													</div>
												</SelectItem>
												<SelectItem value='not available'>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 bg-gray-500 rounded-full'></div>
														Not Available
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Set the initial availability status for this rack
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Configuration Card */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Package className='h-5 w-5' />
								Configuration Options
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 items-start lg:grid-cols-2 gap-8'>
								<FormField
									control={form.control}
									name='availableAciVersions'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Available ACI Versions</FormLabel>
											<FormControl>
												<DynamicListInput {...field} />
											</FormControl>
											<FormDescription>
												Add supported ACI versions (e.g., 5.2(1g), 6.0(2h))
											</FormDescription>
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
											<FormDescription>
												Add available pre-configuration options
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Marketing Details Card */}
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
											<Input
												placeholder='e.g., 2 Leafs · 1 Spine · 1 APIC'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A short feature line displayed under the rack title.
										</FormDescription>
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
										<FormDescription>
											The number of tokens required to book this rack for one hour.
										</FormDescription>
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
										<FormDescription>
											Add key-value pairs for rack specifications.
										</FormDescription>
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
										<FormDescription>
											Add a list of included features.
										</FormDescription>
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
											<Input
												placeholder='e.g., Ready to get started?'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The final line of text before the call to action button.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Topology Configuration Card */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<ImageIcon className='h-5 w-5' />
								Topology Configuration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8'>
								{/* Image Upload Section */}
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
																	onError={(e) => {
																		console.error(
																			'Image failed to load:',
																			e.target.src
																		);
																		console.error(
																			'Original URL:',
																			topologyDiagramValue
																		);
																		console.error(
																			'Display URL:',
																			getImageDisplayUrl(topologyDiagramValue)
																		);
																	}}
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
															{/* Debug info - remove in production */}
															<div className='text-xs text-gray-500 mt-2'>
																<p>Stored URL: {topologyDiagramValue}</p>
																<p>
																	Display URL:{' '}
																	{getImageDisplayUrl(topologyDiagramValue)}
																</p>
															</div>
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
											<FormDescription>
												Upload a topology diagram image for this rack
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* HTML Map Section */}
								<FormField
									control={form.control}
									name='topologyHtmlMap'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Topology HTML Map</FormLabel>
											<FormControl>
												<Textarea
													placeholder={`<map name="topology">
  <area shape="rect" coords="0,0,100,100" href="#device1" alt="Device 1">
  <area shape="circle" coords="200,50,25" href="#device2" alt="Device 2">
</map>`}
													className='font-mono text-xs min-h-[240px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20'
													{...field}
												/>
											</FormControl>
											<FormDescription>
												HTML image map coordinates for interactive topology
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{topologyDiagramValue && form.watch('topologyHtmlMap') && (
								<div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
									<div className='flex items-center gap-2 mb-2'>
										<Info className='h-4 w-4 text-blue-600' />
										<span className='text-sm font-medium text-blue-900'>
											Preview
										</span>
									</div>
									<p className='text-xs text-blue-700'>
										Your topology diagram with interactive map will be available
										once the rack is created.
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Form Actions */}
					<div className='flex flex-col sm:flex-row justify-end gap-3'>
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/admin/racks')}
							className='w-full sm:w-auto cursor-pointer'>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={createRackMutation.isPending || uploadingImage}
							className='w-full sm:w-auto cursor-pointer'>
							{createRackMutation.isPending ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating Rack...
								</>
							) : (
								'Create Rack'
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
