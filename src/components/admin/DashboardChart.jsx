'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Sample data - you can replace this with real data from your API
const chartData = [
	{ month: 'Jan', bookings: 186, revenue: 80000 },
	{ month: 'Feb', bookings: 305, revenue: 120000 },
	{ month: 'Mar', bookings: 237, revenue: 95000 },
	{ month: 'Apr', bookings: 273, revenue: 110000 },
	{ month: 'May', bookings: 209, revenue: 85000 },
	{ month: 'Jun', bookings: 314, revenue: 125000 },
];

const chartConfig = {
	bookings: {
		label: 'Bookings',
		color: 'hsl(var(--primary))',
	},
	revenue: {
		label: 'Revenue',
		color: 'hsl(var(--primary))',
	},
};

export default function DashboardChart() {
	const [timeRange, setTimeRange] = React.useState('6m');

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Performance Overview</CardTitle>
				<CardDescription>
					<span className='hidden @[540px]/card:block'>
						Bookings and revenue for the last 6 months
					</span>
					<span className='@[540px]/card:hidden'>Last 6 months</span>
				</CardDescription>
				<CardAction>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className='flex w-40'
							size='sm'
							aria-label='Select a time range'>
							<SelectValue placeholder='Last 6 months' />
						</SelectTrigger>
						<SelectContent className='rounded-xl'>
							<SelectItem value='6m' className='rounded-lg'>
								Last 6 months
							</SelectItem>
							<SelectItem value='3m' className='rounded-lg'>
								Last 3 months
							</SelectItem>
							<SelectItem value='1m' className='rounded-lg'>
								Last month
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'>
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id='fillBookings' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='5%'
									stopColor='var(--color-bookings)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-bookings)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<Area
							dataKey='bookings'
							type='natural'
							fill='url(#fillBookings)'
							stroke='var(--color-bookings)'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
