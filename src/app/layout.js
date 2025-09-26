import AuthSessionProvider from '@/components/layouts/AuthSessionProvider';
import QueryProvider from '@/components/layouts/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { StudentAuthProvider } from '@/lib/student-auth';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Cisco ACI Rack Management Portal',
	description: 'Book and manage your Cisco ACI lab racks.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' className='h-full bg-gray-50'>
			<body className={`${inter.className} h-full`}>
				<AuthSessionProvider>
					<QueryProvider>
						<StudentAuthProvider>
							{children}
							<Toaster />
						</StudentAuthProvider>
					</QueryProvider>
				</AuthSessionProvider>
				{/* Google Analytics */}
				<Script
					src='https://www.googletagmanager.com/gtag/js?id=G-ZTPVZ6G2XM'
					strategy='afterInteractive'
				/>
				<Script id='google-analytics' strategy='afterInteractive'>
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZTPVZ6G2XM');
          `}
				</Script>

				{/* Razorpay */}
				<Script
					src='https://checkout.razorpay.com/v1/checkout.js'
					strategy='afterInteractive'
				/>
			</body>
		</html>
	);
}
