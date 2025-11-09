import Link from 'next/link';

export default function Header() {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
        Design Database
        <span className="text-blue-600 block">Diagrams with Ease</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Create, edit, and share professional database diagrams. Drag and drop tables, define relationships, and collaborate with your team
        in real-time.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/canvas"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Designing
        </Link>
      </div>
    </div>
  );
}
