import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BookCopy,
	IndianRupee,
	Server,
	TrendingUp,
	Users2,
} from 'lucide-react';

export default function DashboardStats({ stats }) {
	// Convert totalRevenue from paise to rupees for display
	const totalRevenueInRupees = (stats.totalRevenue / 100).toLocaleString(
		'en-IN',
		{
			style: 'currency',
			currency: 'INR',
		}
	);

	const cardData = [
		{
			title: 'Total Revenue',
			value: totalRevenueInRupees,
			icon: IndianRupee,
			description: 'Total earnings from all token pack sales',
			trend: '+12.5%',
			trendUp: true,
			footer: 'Strong revenue growth this quarter',
		},
		{
			title: 'Total Users',
			value: stats.totalUsers.toLocaleString(),
			icon: Users2,
			description: 'All registered users including admins',
			trend: '+8.2%',
			trendUp: true,
			footer: 'User acquisition on track',
		},
		{
			title: 'Total Racks',
			value: stats.totalRacks.toLocaleString(),
			icon: Server,
			description: 'All configured racks in the system',
			trend: 'Stable',
			trendUp: true,
			footer: 'Infrastructure capacity optimal',
		},
		{
			title: 'Total Bookings',
			value: stats.totalBookings.toLocaleString(),
			icon: BookCopy,
			description: 'All historical and upcoming bookings',
			trend: '+15.3%',
			trendUp: true,
			footer: 'Booking activity increasing',
		},
	];

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{cardData.map((card, index) => (
				<Card key={card.title} className='@container/card'>
					<CardHeader>
						<CardDescription>{card.title}</CardDescription>
						<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
							{card.value}
						</CardTitle>
						<CardAction>
							<Badge variant='outline' className='gap-1'>
								<TrendingUp className='h-3 w-3' />
								{card.trend}
							</Badge>
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<card.icon className='h-4 w-4' />
							{card.description}
						</div>
					</CardContent>
					<CardFooter className='flex-col items-start gap-1.5 text-sm'>
						<div className='flex gap-2 font-medium'>
							{card.footer} <TrendingUp className='h-4 w-4' />
						</div>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
