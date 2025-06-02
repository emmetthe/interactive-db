import Header from './components/home/header/header';
import Hero from './components/home/hero/hero';
import Features from './components/home/features/features';
import Pricing from './components/home/section2/section2'; 
import Contact from './components/home/contact/contact';
import Footer from './components/home/footer/footer';

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
