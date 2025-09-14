'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';

// Sortable Item Component
function SortableItem({ id, value, onRemove }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className='flex items-center gap-2 bg-muted p-2 rounded-md'>
			<Button
				type='button'
				variant='ghost'
				size='icon'
				{...attributes}
				{...listeners}
				className='cursor-grab h-8 w-8'>
				<GripVertical className='h-4 w-4' />
			</Button>
			<span className='flex-1 text-sm'>{value}</span>
			<Button
				type='button'
				variant='ghost'
				size='icon'
				onClick={() => onRemove(id)}
				className='h-8 w-8 text-muted-foreground hover:text-destructive'>
				<X className='h-4 w-4' />
			</Button>
		</div>
	);
}

// Main Dynamic List Component
export default function DynamicListInput({ value = [], onChange }) {
	const [inputValue, setInputValue] = React.useState('');
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleAddItem = () => {
		if (inputValue && !value.includes(inputValue)) {
			onChange([...value, inputValue]);
			setInputValue('');
		}
	};

	const handleRemoveItem = (itemToRemove) => {
		onChange(value.filter((item) => item !== itemToRemove));
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = value.indexOf(active.id);
			const newIndex = value.indexOf(over.id);
			onChange(arrayMove(value, oldIndex, newIndex));
		}
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center gap-2'>
				<Input
					type='text'
					placeholder='Enter a value...'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleAddItem();
						}
					}}
				/>
				<Button
					type='button'
					className='cursor-pointer'
					onClick={handleAddItem}>
					<Plus className='h-4 w-4' />
					Add
				</Button>
			</div>
			<div className='space-y-2 rounded-md border p-2 min-h-[100px]'>
				{value.length > 0 ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}>
						<SortableContext
							items={value}
							strategy={verticalListSortingStrategy}>
							{value.map((item) => (
								<SortableItem
									key={item}
									id={item}
									value={item}
									onRemove={handleRemoveItem}
								/>
							))}
						</SortableContext>
					</DndContext>
				) : (
					<div className='flex items-center justify-center h-full text-sm text-muted-foreground p-4'>
						No items added.
					</div>
				)}
			</div>
		</div>
	);
}
