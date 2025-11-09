import Navbar from './navbar';
import Header from './header';
import Features from './features';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Header />
        <Features />
      </main>
    </div>
  );
}
