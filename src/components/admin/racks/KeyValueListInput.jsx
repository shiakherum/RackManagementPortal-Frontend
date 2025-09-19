'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import * as React from 'react';

export default function KeyValueListInput({ value = [], onChange }) {
	const [items, setItems] = React.useState(value);

	const handleAddItem = () => {
		const newItems = [...items, { specName: '', specValue: '' }];
		setItems(newItems);
		onChange(newItems);
	};

	const handleItemChange = (index, field, fieldValue) => {
		const newItems = [...items];
		newItems[index][field] = fieldValue;
		setItems(newItems);
		onChange(newItems);
	};

	const handleRemoveItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setItems(newItems);
		onChange(newItems);
	};

	return (
		<div className='space-y-4'>
			{items.map((item, index) => (
				<div key={index} className='flex items-center gap-2'>
					<Input
						placeholder='Specification Name'
						value={item.specName}
						onChange={(e) => handleItemChange(index, 'specName', e.target.value)}
					/>
					<Input
						placeholder='Specification Value'
						value={item.specValue}
						onChange={(e) => handleItemChange(index, 'specValue', e.target.value)}
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => handleRemoveItem(index)}>
						<Trash2 className='h-4 w-4 text-red-500' />
					</Button>
				</div>
			))}
			<Button type='button' variant='outline' size='sm' onClick={handleAddItem}>
				Add Specification
			</Button>
		</div>
	);
}
