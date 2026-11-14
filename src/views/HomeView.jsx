// /: the landing page. Each section is a self-contained component in components/home/.
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import StatBanner from '../components/home/StatBanner';
import useDocumentTitle from '../components/layout/useDocumentTitle';

export default function HomeView() {
  useDocumentTitle('');
  return (
    <>
      <Hero />
      <FeatureGrid />
      <StatBanner />
    </>
  );
}
