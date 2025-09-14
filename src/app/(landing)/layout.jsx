import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';

export default function LandingLayout({ children }) {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div style={{ height: '64px' }} />
			<main className='flex-grow'>{children}</main>
			<Footer />
		</div>
	);
}
