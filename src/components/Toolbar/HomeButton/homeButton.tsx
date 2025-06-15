import Link from 'next/link';

export default function HomeButton() {
  return (
    <Link href="/" className="text-xl font-semibold hover:opacity-80 transition">
      Home
    </Link>
  );
}
