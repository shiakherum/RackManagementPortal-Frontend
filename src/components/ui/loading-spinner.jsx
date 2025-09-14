import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, ...props }) {
	return (
		<div
			className={cn(
				'flex items-center justify-center space-x-2',
				className
			)}
			{...props}>
			<div className='h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent'></div>
			<span className='text-sm text-gray-600'>Loading...</span>
		</div>
	);
}