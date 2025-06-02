import FadeIn from '../fadeIn/fadeIn';

const Section2 = () => (
  <section id="pricing" className="w-full py-20 bg-gray-800 text-white text-center">
    <FadeIn>
      <h2 className="text-3xl font-bold mb-12">Pricing</h2>
    </FadeIn>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {['Basic', 'Pro', 'Enterprise'].map((plan, i) => (
        <FadeIn key={i} delay={i * 0.2}>
          <div className="bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{plan}</h3>
            <p className="text-4xl font-bold mb-4">${(i + 1) * 10}</p>
            <ul className="mb-6 text-gray-400 space-y-2">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Choose Plan</button>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

export default Section2;
