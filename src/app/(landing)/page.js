import CTA from '@/components/landing/home-page/CTA';
import Features from '@/components/landing/home-page/Features';
import Hero from '@/components/landing/home-page/Hero';
import POC from '@/components/landing/home-page/POC';
import RackCards from '@/components/landing/home-page/RacksSection';
import TokenPacks from '@/components/landing/home-page/TokenPacks';

export default function HomePage() {
	return (
		<>
			<Hero />
			<RackCards />
			<Features />
			<POC />
			<TokenPacks />
			<CTA />
		</>
	);
}
