'use client';
import FadeIn from '../fadeIn/fadeIn';
import generateUniqueId from '../../../utility/generateId';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const getSessionId = () => {
    const uniqueId = generateUniqueId();
    router.push(`/${uniqueId}`);
  };

  return (
    <section className="w-full bg-gray-800 py-20 text-center text-white">
      <FadeIn>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          Build Faster with <span className="text-blue-400">App Name</span>
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 text-lg sm:text-xl text-gray-300">Streamline your workflow with our powerful, intuitive tools.</p>
      </FadeIn>
      <FadeIn delay={0.4}>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={getSessionId}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Get Started Free
          </button>
          <button className="px-8 py-3 bg-gray-700 text-white rounded-lg text-lg hover:bg-gray-600 transition cursor-pointer">
            Learn More
          </button>
        </div>
      </FadeIn>
    </section>
  );
}
