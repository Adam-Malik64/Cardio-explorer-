// /: the landing page. Each section is a self-contained component in components/home/.
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import StatBanner from '../components/home/StatBanner';

export default function HomeView() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <StatBanner />
    </>
  );
}
