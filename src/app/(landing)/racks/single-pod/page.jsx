import CallToAction from '@/components/landing/single-rack/CallToAction';
import MoreDetails from '@/components/landing/single-rack/MoreDetails';
import PlatformFeatures from '@/components/landing/single-rack/PlatformFaqs';
import RackHero from '@/components/landing/single-rack/RackHero';

export default function SinglePod() {
	return (
		<>
			<RackHero />
			<MoreDetails />
			<PlatformFeatures />
			<CallToAction />
		</>
	);
}
