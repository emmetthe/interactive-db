import FadeIn from '../fadeIn/fadeIn';

const Features = () => (
  <section id="features" className="w-full py-20 bg-gray-900 text-white">
    <FadeIn>
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
    </FadeIn>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {['Automation', 'Collaboration', 'Customization'].map((feature, index) => (
        <FadeIn key={index} delay={index * 0.2}>
          <div className="p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{feature}</h3>
            <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis est tam dissimile homini.</p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

export default Features;
