import Header from '../components/Home/header/header';
import Hero from '../components/Home/hero/hero';
import Features from '../components/Home/features/features';
import Pricing from '../components/Home/section2/section2';
import Contact from '../components/Home/contact/contact';
import Footer from '../components/Home/footer/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gray-950 text-white">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
