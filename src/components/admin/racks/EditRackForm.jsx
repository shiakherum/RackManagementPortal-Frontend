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
	Image as ImageIcon,
	Info,
	Loader2,
	Package,
	Upload,
	X,
} from 'lucide-react';

// Zod schema for validation, matching the AddRackForm schema
const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Rack name must be at least 3 characters.' })
		.max(100),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters.' })
		.max(1000),
	deviceId: z.string().min(1, { message: 'Device ID is required.' }).max(50),
	status: z.enum(['available', 'not available']),
	availableAciVersions: z.array(z.string()).default([]),
	preConfigOptions: z.array(z.string()).default([]),
	topologyDiagram: z.string().optional(),
	topologyHtmlMap: z.string().optional(),
});

export default function EditRackForm({ rack }) {
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
			name: rack.name || '',
			description: rack.description || '',
			deviceId: rack.deviceId || '',
			status: rack.status || 'available',
			availableAciVersions: rack.availableAciVersions || [],
			preConfigOptions: rack.preConfigOptions || [],
			topologyDiagram: rack.topologyDiagram || '',
			topologyHtmlMap: rack.topologyHtmlMap || '',
		},
	});

	const topologyDiagramValue = form.watch('topologyDiagram');

	const getImageDisplayUrl = (imageUrl) => {
		if (!imageUrl) return '';
		if (imageUrl.startsWith('http')) return imageUrl;
		return `${
			process.env.NEXT_PUBLIC_API_STATIC_URL || 'http://localhost:5001'
		}${imageUrl}`;
	};

	const updateRackMutation = useMutation({
		mutationFn: (updatedRackData) => {
			return api.patch(`/racks/${rack._id}`, updatedRackData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminRacks'] });
			queryClient.invalidateQueries({ queryKey: ['adminRack', rack._id] });
			router.push('/admin/racks');
		},
		onError: (error) => {
			setServerError(
				error.response?.data?.message || 'An unexpected error occurred.'
			);
		},
	});

	const handleImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

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
			const response = await api.post('/upload/topology-diagram', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			form.setValue('topologyDiagram', response.data.data.imageUrl);
			setUploadSuccess(true);
			setTimeout(() => setUploadSuccess(false), 3000);
		} catch (error) {
			setServerError(
				error.response?.data?.message || 'Failed to upload image.'
			);
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
												<Input placeholder='e.g., ACI Pod 1' {...field} />
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
													className='font-mono'
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
												placeholder="Describe the rack's purpose..."
												className='min-h-[120px] resize-none'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Detailed information about this rack's capabilities
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
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='max-w-xs'>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='available'>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 bg-green-500 rounded-full' />
														Available
													</div>
												</SelectItem>
												<SelectItem value='not available'>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 bg-gray-500 rounded-full' />
														Not Available
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Set the current availability status for this rack
										</FormDescription>
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
						<CardContent>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
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
												Add supported ACI versions (e.g., 5.2(1g))
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

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<ImageIcon className='h-5 w-5' />
								Topology Configuration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8'>
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
															<div className='rounded-lg border-2 border-dashed border-green-200 bg-green-50/50 p-4'>
																<img
																	src={getImageDisplayUrl(topologyDiagramValue)}
																	alt='Topology Diagram'
																	className='max-w-full h-auto rounded-md shadow-sm'
																/>
																<Button
																	type='button'
																	variant='destructive'
																	size='icon'
																	className='absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
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
															className='relative rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary/50 cursor-pointer group'
															onClick={() => fileInputRef.current?.click()}>
															{uploadingImage ? (
																<div className='flex flex-col items-center gap-3'>
																	<Loader2 className='h-8 w-8 text-primary animate-spin' />
																	<p className='text-sm text-gray-600 font-medium'>
																		Uploading...
																	</p>
																</div>
															) : (
																<div className='flex flex-col items-center gap-3'>
																	<div className='p-3 bg-gray-100 rounded-full group-hover:bg-primary/10'>
																		<Upload className='h-8 w-8 text-gray-400 group-hover:text-primary' />
																	</div>
																	<div>
																		<p className='text-sm font-medium text-gray-900'>
																			<span className='text-primary'>
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
														accept='image/png,image/jpeg'
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
													className='font-mono text-xs min-h-[240px] resize-none'
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
						</CardContent>
					</Card>

					<div className='flex justify-end gap-3'>
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/admin/racks')}>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={updateRackMutation.isPending || uploadingImage}>
							{updateRackMutation.isPending ? (
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
